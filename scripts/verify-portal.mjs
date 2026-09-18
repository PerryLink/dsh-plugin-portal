#!/usr/bin/env node
// Portal gate. Zero dependencies: `node:` builtins only (asserted by check 1, so
// the portal stays runnable from a bare checkout with no package manager and no
// install step - the whole point of this repository).
//
// Checks:
//   1. this script imports nothing but `node:` builtins;
//   2. data/repos.json parses and every entry satisfies the roster contract;
//   3. the inline script in index.html parses (`new vm.Script`) and runs;
//   4. every roster entry has a blurb in DESCRIPTIONS and every group a label -
//      a roster entry that is merely ahead of its blurb must be registered in
//      PENDING_DESCRIPTION rather than pass silently;
//   5. star badges derive their owner from repo.github (a hardcoded owner 404s
//      every non-PerryLink entry);
//   6. data/repos.json is a verbatim copy of the dsh-plugin-kit roster except
//      for `_source`, and the sha256 recorded in `_source` still matches that
//      upstream file. When the sibling kit checkout is absent (CI runners) this
//      check reports SKIP instead of failing - a gate that is red on every
//      runner is not a gate;
//   7. counts are printed for the README, which must not hardcode them.
//
// Usage: node scripts/verify-portal.mjs [--root <dir>] [--quiet]
//   --root  verify a different tree (used to drive the negative cases)
//   --quiet print only failures and the final summary

import { readFileSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'

const HERE = dirname(fileURLToPath(import.meta.url))
const DEFAULT_ROOT = resolve(HERE, '..')

// Roster entries allowed to be ahead of this portal's copy, and entries allowed
// to have no blurb yet. Empty is the healthy state: adding a name here is the
// deliberate, reviewable "we know about it" escape hatch (card §3), not a way
// to silence drift.
const PENDING_ROSTER_SYNC = []
const PENDING_DESCRIPTION = []

const args = process.argv.slice(2)
const rootFlag = args.indexOf('--root')
const ROOT = rootFlag === -1 ? DEFAULT_ROOT : resolve(args[rootFlag + 1] ?? '')
const QUIET = args.includes('--quiet')

if (rootFlag !== -1 && !args[rootFlag + 1]) {
  console.error('verify-portal: --root needs a directory')
  process.exit(1)
}

const failures = []
const notices = []
const fail = (message) => failures.push(message)
const notice = (message) => notices.push(message)
const ok = (message) => { if (!QUIET) console.log(`ok   ${message}`) }
const skip = (message) => { if (!QUIET) console.log(`skip ${message}`) }

const readText = (absolute) => readFileSync(absolute, 'utf8')
const sha256 = (text) => createHash('sha256').update(text, 'utf8').digest('hex')

const canon = (value) => {
  if (Array.isArray(value)) return value.map(canon)
  if (value && typeof value === 'object') {
    const out = {}
    for (const key of Object.keys(value).sort()) out[key] = canon(value[key])
    return out
  }
  return value
}

// ---------------------------------------------------------------- 1. imports
{
  const self = readText(fileURLToPath(import.meta.url))
  const specifiers = [...self.matchAll(/(?:from|import)\s*\(?\s*['"]([^'"]+)['"]/g)].map((m) => m[1])
  const foreign = specifiers.filter((spec) => !spec.startsWith('node:'))
  if (foreign.length > 0) fail(`check 1: non-builtin import(s): ${foreign.join(', ')}`)
  else ok(`check 1: zero dependencies (${specifiers.length} import(s), all node: builtins)`)
}

// ------------------------------------------------------------------ 2. roster
const rosterPath = join(ROOT, 'data', 'repos.json')
let roster = null
if (!existsSync(rosterPath)) {
  fail(`check 2: ${rosterPath} is missing`)
} else {
  try {
    roster = JSON.parse(readText(rosterPath))
  } catch (error) {
    fail(`check 2: data/repos.json does not parse: ${error.message}`)
  }
}

const NAME_RE = /^[a-z0-9][a-z0-9-]*$/
if (roster !== null) {
  const problems = []
  if (typeof roster._source !== 'string' || roster._source.length === 0) problems.push('_source must be a non-empty string')
  if (!Array.isArray(roster.repos) || roster.repos.length === 0) problems.push('repos must be a non-empty array')
  for (const [index, entry] of (Array.isArray(roster.repos) ? roster.repos : []).entries()) {
    const at = `repos[${index}]`
    if (typeof entry?.name !== 'string' || !NAME_RE.test(entry.name)) problems.push(`${at}.name is not a kebab-case repo name`)
    if (typeof entry?.group !== 'string' || entry.group.length === 0) problems.push(`${at}.group must be a non-empty string`)
    if (typeof entry?.role !== 'string' || entry.role.length === 0) problems.push(`${at}.role must be a non-empty string`)
    if (entry?.star !== null && !Number.isInteger(entry?.star)) problems.push(`${at}.star must be an integer or null`)
    let url = null
    try {
      url = new URL(entry?.github)
    } catch {
      problems.push(`${at}.github is not a valid URL`)
    }
    if (url !== null) {
      if (url.protocol !== 'https:') problems.push(`${at}.github must be https`)
      if (url.hostname !== 'github.com') problems.push(`${at}.github must point at github.com`)
      const segments = url.pathname.split('/').filter(Boolean)
      if (segments.length !== 2) problems.push(`${at}.github must be https://github.com/<owner>/<repo>`)
      if (segments.length === 2 && segments[1].replace(/\.git$/, '') !== entry.name) {
        problems.push(`${at}.github repo segment "${segments[1]}" does not match name "${entry.name}"`)
      }
    }
  }
  const names = (Array.isArray(roster.repos) ? roster.repos : []).map((entry) => entry?.name)
  const duplicates = names.filter((name, index) => names.indexOf(name) !== index)
  if (duplicates.length > 0) problems.push(`duplicate roster name(s): ${[...new Set(duplicates)].join(', ')}`)

  if (problems.length > 0) for (const problem of problems) fail(`check 2: ${problem}`)
  else ok(`check 2: roster contract holds for ${roster.repos.length} entries`)
}

// ------------------------------------------------------- 3./4./5. inline page
const htmlPath = join(ROOT, 'index.html')
let html = null
let probe = null
if (!existsSync(htmlPath)) {
  fail(`check 3: ${htmlPath} is missing`)
} else {
  html = readText(htmlPath)
  const blocks = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)]
  if (blocks.length !== 1) {
    fail(`check 3: expected exactly 1 inline <script> block, found ${blocks.length}`)
  } else {
    const inline = blocks[0][1]
    const warnings = []
    const makeElement = (tag) => {
      const element = {
        tag,
        className: '',
        textContent: '',
        src: '',
        alt: '',
        href: '',
        target: '',
        rel: '',
        loading: '',
        children: [],
        appendChild(child) { this.children.push(child); return child },
        classList: { add() {} },
      }
      return element
    }
    const context = {
      console: { warn: (message) => warnings.push(String(message)), log() {}, error() {} },
      fetch: () => Promise.reject(new Error('the gate never loads the roster over HTTP')),
      document: { createElement: makeElement, getElementById: () => makeElement('div') },
      URL,
    }
    try {
      vm.createContext(context)
      new vm.Script(`${inline}\n;globalThis.__probe = { DESCRIPTIONS, GROUP_EN, starsBadge, ownerOf, card };`).runInContext(context)
      probe = context.__probe
      ok('check 3: the inline script parses and runs under a DOM stub')
    } catch (error) {
      fail(`check 3: the inline script does not parse or run: ${error.message}`)
    }
  }
}

if (probe !== null && roster !== null) {
  const descriptions = probe.DESCRIPTIONS
  const groupLabels = probe.GROUP_EN
  if (descriptions === undefined || groupLabels === undefined) {
    fail('check 4: DESCRIPTIONS / GROUP_EN are not reachable from the inline script')
  } else {
    const undescribed = roster.repos
      .map((entry) => entry.name)
      .filter((name) => !Object.prototype.hasOwnProperty.call(descriptions, name))
      .filter((name) => !PENDING_DESCRIPTION.includes(name))
    const knownButPending = PENDING_DESCRIPTION.filter((name) => !roster.repos.some((entry) => entry.name === name))
    const unlabelled = [...new Set(roster.repos.map((entry) => entry.group))]
      .filter((group) => !Object.prototype.hasOwnProperty.call(groupLabels, group))
    const staleKeys = Object.keys(descriptions).filter((name) => !roster.repos.some((entry) => entry.name === name))

    if (undescribed.length > 0) fail(`check 4: roster entries without a DESCRIPTIONS blurb: ${undescribed.join(', ')} (add the blurb, or register the name in PENDING_DESCRIPTION)`)
    if (unlabelled.length > 0) fail(`check 4: groups without a GROUP_EN label: ${unlabelled.join(', ')}`)
    if (knownButPending.length > 0) notice(`check 4: PENDING_DESCRIPTION lists ${knownButPending.length} name(s) no longer in the roster: ${knownButPending.join(', ')} - prune them`)
    if (staleKeys.length > 0) notice(`check 4: DESCRIPTIONS has ${staleKeys.length} key(s) no longer in the roster: ${staleKeys.join(', ')}`)
    if (undescribed.length === 0 && unlabelled.length === 0) {
      ok(`check 4: every roster entry has a blurb (${Object.keys(descriptions).length} registered) and every group a label`)
    }

    // 5. badge owner is derived, not hardcoded
    const badgeProblems = []
    for (const entry of roster.repos) {
      const url = probe.starsBadge(entry)
      const owner = probe.ownerOf(entry)
      if (!url.includes(`/github/stars/${owner}/${entry.name}.svg`)) {
        badgeProblems.push(`${entry.name}: badge URL "${url}" does not carry owner "${owner}"`)
      }
    }
    // The card's regression case: a third-party owner must survive the same path.
    const thirdParty = { name: 'dsh-wechat', github: 'https://github.com/pan17/dsh-wechat' }
    if (!probe.starsBadge(thirdParty).includes('/github/stars/pan17/dsh-wechat.svg')) {
      badgeProblems.push('a third-party owner (pan17/dsh-wechat) does not reach the badge URL')
    }
    if (/stars\/PerryLink\//.test(html)) badgeProblems.push('index.html still hardcodes stars/PerryLink/')
    if (badgeProblems.length > 0) for (const problem of badgeProblems) fail(`check 5: ${problem}`)
    else ok('check 5: star badges resolve their owner from repo.github (incl. third-party owners)')
  }
}

// --------------------------------------------------- 6. upstream roster parity
const kitRosterPath = resolve(ROOT, '..', 'dsh-plugin-kit', 'data', 'repos.json')
if (roster === null) {
  skip('check 6: roster did not parse, upstream parity not evaluated')
} else if (!existsSync(kitRosterPath)) {
  skip('check 6: sibling dsh-plugin-kit checkout absent - roster parity is not verifiable on this runner')
} else {
  const kitText = readText(kitRosterPath)
  const recorded = /sha256:\s*([0-9a-fA-F]{64})/.exec(roster._source)?.[1]
  const actual = sha256(kitText)
  if (recorded === undefined) {
    fail('check 6: data/repos.json _source does not record the upstream sha256')
  } else if (recorded.toLowerCase() !== actual) {
    fail(`check 6: upstream dsh-plugin-kit/data/repos.json changed (sha256 ${actual.slice(0, 12)}… != recorded ${recorded.slice(0, 12)}…) - re-copy it and update _source`)
  } else {
    ok(`check 6: recorded upstream sha256 matches (${actual.slice(0, 12)}…)`)
  }

  let kit = null
  try {
    kit = JSON.parse(kitText)
  } catch (error) {
    fail(`check 6: upstream roster does not parse: ${error.message}`)
  }
  if (kit !== null) {
    const stripSource = (value) => {
      const { _source, ...rest } = value
      return rest
    }
    const local = JSON.stringify(canon(stripSource(roster)))
    const upstream = JSON.stringify(canon(kit))
    if (local !== upstream) {
      fail('check 6: data/repos.json is not a verbatim copy of the upstream roster (only `_source` may differ)')
    } else {
      ok('check 6: data/repos.json is a verbatim copy of the upstream roster (except `_source`)')
    }
    const upstreamNames = new Set(kit.repos.map((entry) => entry.name))
    const localNames = new Set(roster.repos.map((entry) => entry.name))
    const missing = [...upstreamNames].filter((name) => !localNames.has(name))
    const extra = [...localNames].filter((name) => !upstreamNames.has(name))
    const unregistered = missing.filter((name) => !PENDING_ROSTER_SYNC.includes(name))
    if (unregistered.length > 0) fail(`check 6: upstream entries missing here and not registered in PENDING_ROSTER_SYNC: ${unregistered.join(', ')}`)
    if (extra.length > 0) fail(`check 6: entries that exist only here and not upstream: ${extra.join(', ')}`)
    if (unregistered.length === 0 && extra.length === 0) ok('check 6: roster membership matches upstream')
  }
}

// --------------------------------------------------- 7. counts are not frozen
if (roster !== null) {
  const perGroup = new Map()
  for (const entry of roster.repos) perGroup.set(entry.group, (perGroup.get(entry.group) ?? 0) + 1)
  if (!QUIET) {
    console.log(`counts: ${roster.repos.length} entries in ${perGroup.size} groups (source of truth for the README)`)
    for (const [group, count] of perGroup) console.log(`  ${group} = ${count}`)
  }
}

const readmePath = join(ROOT, 'README.md')
if (!existsSync(readmePath)) {
  notice('check 7: README.md is missing')
} else {
  const readme = readText(readmePath)
  const frozen = []
  if (/repos\.length\s*!==\s*\d+/.test(readme)) frozen.push('a `repos.length !== <n>` assertion')
  if (/expected\s+\d+\s+repos/i.test(readme)) frozen.push('an `expected <n> repos` assertion')
  if (frozen.length > 0) {
    fail(`check 7: README.md hardcodes ${frozen.join(' and ')} - counts come from this script (run it and cite the output)`)
  } else {
    ok('check 7: README.md carries no frozen count assertion')
  }
  if (/\b\d+\s*(entries|项)/.test(readme)) {
    notice('check 7: README.md still states a count in prose - prefer citing this script\'s output')
  }
}

// ----------------------------------------------------------------- reporting
for (const message of notices) console.log(`note ${message}`)
if (failures.length > 0) {
  console.error(`\nverify-portal: FAIL (${failures.length})`)
  for (const message of failures) console.error(`  - ${message}`)
  process.exit(1)
}
console.log('\nverify-portal: PASS (roster + inline script + upstream parity + counts)')
