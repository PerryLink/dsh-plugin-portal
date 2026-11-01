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
//   7. counts are printed for the README, which must not hardcode them;
//   8. data/levels.json only references roster repos, uses the per-level status
//      enum, and every evidence-bearing status (runtime/measured/manual) carries
//      an https evidence.url - not-run is never upgraded to a pass;
//   9. data/attestations.json mirrors the standard-repository index: unique
//      attestationId, real expiry dates, and no `level` field anywhere (a grade
//      is orthogonal to an adoption level);
//  10. verify.html parses, shows the non-official disclaimer in the same view,
//      and renders an expired/withdrawn record as stale/withdrawn - never valid;
//  11. index.html renders the optional levels row, shows no empty badge, and
//      links evidence when a record has one.
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
      new vm.Script(`${inline}\n;globalThis.__probe = { DESCRIPTIONS, GROUP_EN, starsBadge, ownerOf, card, levelChips };`).runInContext(context)
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

// ------------------------------------------------------- 8. adoption levels
const isCalendarDate = (value) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const time = Date.parse(`${value}T00:00:00Z`)
  return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === value
}

const LEVEL_STATUS = {
  entry: new Set(['recognized', 'static', 'runtime', 'blocked', 'failed', 'not-run', 'stale', 'withdrawn', 'not-applicable']),
  flow: new Set(['manual', 'runtime', 'failed', 'not-run', 'stale', 'withdrawn', 'not-applicable']),
  boost: new Set(['measured', 'not-measured', 'failed', 'stale', 'withdrawn', 'not-applicable']),
}
const LEVEL_AXES = ['entry', 'flow', 'boost']
const EVIDENCE_BEARING = new Set(['runtime', 'measured', 'manual'])
const HTTPS_RE = /^https:\/\//

const levelsPath = join(ROOT, 'data', 'levels.json')
let levels = null
if (!existsSync(levelsPath)) {
  fail('check 8: data/levels.json is missing')
} else {
  try {
    const parsed = JSON.parse(readText(levelsPath))
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) fail('check 8: data/levels.json must be a JSON object')
    else levels = parsed
  } catch (error) {
    fail(`check 8: data/levels.json does not parse: ${error.message}`)
  }
}

if (levels !== null) {
  const problems = []
  if (typeof levels.schema !== 'string' || levels.schema.length === 0) problems.push('schema must be a non-empty string')
  if (levels.nonOfficial !== true) problems.push('nonOfficial must be true')
  if (typeof levels.disclaimer !== 'string' || !/非官方/.test(levels.disclaimer) || !/非认证/.test(levels.disclaimer) || !/非安全审计/.test(levels.disclaimer)) {
    problems.push('disclaimer must carry the 非官方 / 非认证 / 非安全审计 denial')
  }
  if (!isCalendarDate(levels.updatedAt)) problems.push('updatedAt must be a real YYYY-MM-DD date')
  if (levels.source === null || typeof levels.source !== 'object' || Array.isArray(levels.source)) {
    problems.push('source must be an object describing the read-only upstream')
  }
  if (!Array.isArray(levels.levels)) {
    problems.push('levels must be an array')
  } else if (roster !== null) {
    const rosterNames = new Set(roster.repos.map((entry) => entry.name))
    const seen = new Set()
    for (const [index, row] of levels.levels.entries()) {
      const at = `levels[${index}]`
      if (typeof row?.repo !== 'string' || row.repo.length === 0) {
        problems.push(`${at}.repo must be a non-empty string`)
      } else if (!rosterNames.has(row.repo)) {
        problems.push(`${at}.repo "${row.repo}" is not in the roster`)
      } else if (seen.has(row.repo)) {
        problems.push(`${at}.repo "${row.repo}" is duplicated`)
      } else {
        seen.add(row.repo)
      }
      for (const axis of LEVEL_AXES) {
        const cell = row?.[axis]
        if (cell === null || typeof cell !== 'object' || Array.isArray(cell)) {
          problems.push(`${at}.${axis} must be an object with status/evidence`)
          continue
        }
        if (!LEVEL_STATUS[axis].has(cell.status)) {
          problems.push(`${at}.${axis}.status "${cell.status}" is outside ${axis}'s allowed enum (${[...LEVEL_STATUS[axis]].join('|')})`)
        }
        let evidenceUrl = null
        if (cell.evidence !== null && cell.evidence !== undefined) {
          if (typeof cell.evidence !== 'object' || Array.isArray(cell.evidence)) {
            problems.push(`${at}.${axis}.evidence must be null or an object with a url`)
          } else if (typeof cell.evidence.url !== 'string' || !HTTPS_RE.test(cell.evidence.url)) {
            problems.push(`${at}.${axis}.evidence.url must be an https URL`)
          } else {
            evidenceUrl = cell.evidence.url
          }
        }
        if (EVIDENCE_BEARING.has(cell.status) && evidenceUrl === null) {
          problems.push(`${at}.${axis}: status "${cell.status}" requires evidence.url`)
        }
      }
    }
    const missing = [...rosterNames].filter((name) => !seen.has(name))
    if (missing.length > 0) problems.push(`roster repos without a levels entry: ${missing.join(', ')}`)
  }

  if (problems.length > 0) {
    for (const problem of problems) fail(`check 8: ${problem}`)
  } else if (roster === null) {
    skip('check 8: data/levels.json parses, but the roster did not parse so repo coverage was not evaluated')
  } else {
    ok(`check 8: levels cover all ${roster.repos.length} roster repos, statuses are in-enum, and every runtime/measured/manual record has an evidence URL`)
  }
}

// --------------------------------------------------- 9. attestation mirror
const ATTESTATION_STATUS = new Set(['draft', 'active', 'suspended', 'withdrawn', 'expired'])
const findLevelKeys = (value, at = '$', found = []) => {
  if (Array.isArray(value)) {
    value.forEach((item, index) => findLevelKeys(item, `${at}[${index}]`, found))
  } else if (value !== null && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      if (key === 'level') found.push(`${at}.level`)
      findLevelKeys(child, `${at}.${key}`, found)
    }
  }
  return found
}

const attestationsPath = join(ROOT, 'data', 'attestations.json')
let attestations = null
if (!existsSync(attestationsPath)) {
  fail('check 9: data/attestations.json is missing')
} else {
  try {
    const parsed = JSON.parse(readText(attestationsPath))
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) fail('check 9: data/attestations.json must be a JSON object')
    else attestations = parsed
  } catch (error) {
    fail(`check 9: data/attestations.json does not parse: ${error.message}`)
  }
}

if (attestations !== null) {
  const problems = []
  if (typeof attestations.schema !== 'string' || attestations.schema.length === 0) problems.push('schema must be a non-empty string')
  const source = attestations.source
  if (source === null || typeof source !== 'object' || Array.isArray(source)) {
    problems.push('source must be an object pointing at the standard-repository path and/or URL')
  } else {
    const hasPath = typeof source.path === 'string' && source.path.length > 0
    const hasUrl = typeof source.url === 'string' && HTTPS_RE.test(source.url)
    if (!hasPath && !hasUrl) problems.push('source.path or an https source.url is required')
    if (source.url !== undefined && !hasUrl) problems.push('source.url must be an https URL when present')
  }
  if (!Array.isArray(attestations.attestations)) {
    problems.push('attestations must be an array')
  } else {
    const ids = new Set()
    for (const [index, item] of attestations.attestations.entries()) {
      const at = `attestations[${index}]`
      if (typeof item?.attestationId !== 'string' || item.attestationId.length === 0) {
        problems.push(`${at}.attestationId must be a non-empty string`)
      } else if (ids.has(item.attestationId)) {
        problems.push(`${at}.attestationId "${item.attestationId}" is duplicated`)
      } else {
        ids.add(item.attestationId)
      }
      if (typeof item?.status !== 'string' || !ATTESTATION_STATUS.has(item.status)) {
        problems.push(`${at}.status must be draft|active|suspended|withdrawn|expired`)
      }
      if (!isCalendarDate(item?.expiresAt)) problems.push(`${at}.expiresAt must be a real YYYY-MM-DD date`)
      if (item?.issuedAt !== undefined && !isCalendarDate(item.issuedAt)) {
        problems.push(`${at}.issuedAt must be a real YYYY-MM-DD date when present`)
      }
      if (isCalendarDate(item?.issuedAt) && isCalendarDate(item?.expiresAt) && Date.parse(item.expiresAt) <= Date.parse(item.issuedAt)) {
        problems.push(`${at}.expiresAt must be after issuedAt`)
      }
      if (item?.file !== undefined && (typeof item.file !== 'string' || !/^publish\/attestations\/[A-Za-z0-9._-]+\.json$/.test(item.file) || item.file.includes('..'))) {
        problems.push(`${at}.file must be a safe publish/attestations/<name>.json path`)
      }
      if (isCalendarDate(item?.expiresAt) && item.status === 'active' && Date.parse(`${item.expiresAt}T23:59:59Z`) < Date.now()) {
        notice(`check 9: ${item.attestationId} is declared active but expiresAt has passed - verify.html renders it stale; refresh the mirror and the upstream record`)
      }
    }

    const entryLevels = findLevelKeys(attestations.attestations, 'attestations')
    if (entryLevels.length > 0) {
      problems.push(`attestation entries must not carry a level field (A-D is orthogonal to ENTRY/FLOW/BOOST): ${entryLevels.join(', ')}`)
    }

    const records = attestations.records
    if (records === null || typeof records !== 'object' || Array.isArray(records)) {
      problems.push('records must be an object keyed by attestationId (verify.html renders scope/excluded/disclaimer/evidence from it)')
    } else {
      for (const item of attestations.attestations) {
        const id = item?.attestationId
        if (typeof id !== 'string' || id.length === 0) continue
        if (!Object.prototype.hasOwnProperty.call(records, id)) {
          problems.push(`records is missing detail for "${id}" - verify.html cannot render scope/excluded/disclaimer/evidence`)
          continue
        }
        const record = records[id]
        if (record === null || typeof record !== 'object' || Array.isArray(record)) {
          problems.push(`records["${id}"] must be an object`)
          continue
        }
        if (record.attestationId !== id) {
          problems.push(`records["${id}"].attestationId does not match its key`)
          continue
        }
        const drift = []
        if (record.status !== item.status) drift.push('status')
        if (record.grade !== item.grade) drift.push('grade')
        if (record.claimLevel !== item.claimLevel) drift.push('claimLevel')
        if (record.issuedAt !== item.issuedAt) drift.push('issuedAt')
        if (record.expiresAt !== item.expiresAt) drift.push('expiresAt')
        if (record.verifyUrl !== item.verifyUrl) drift.push('verifyUrl')
        if (record.subject?.repo !== item.repo) drift.push('subject.repo')
        if (record.subject?.version !== item.version) drift.push('subject.version')
        if (drift.length > 0) {
          problems.push(`records["${id}"] disagrees with the index on ${drift.join(', ')} - copy the attestation file verbatim`)
        }
      }
      const orphans = Object.keys(records).filter((key) => !ids.has(key))
      if (orphans.length > 0) notice(`check 9: records carries detail for unknown attestation(s): ${orphans.join(', ')}`)
      const recordLevels = findLevelKeys(records, 'records')
      if (recordLevels.length > 0) {
        problems.push(`attestation records must not carry a level field (A-D is orthogonal to ENTRY/FLOW/BOOST): ${recordLevels.join(', ')}`)
      }
    }
  }

  if (problems.length > 0) {
    for (const problem of problems) fail(`check 9: ${problem}`)
  } else {
    ok(`check 9: ${attestations.attestations.length} mirrored attestation(s), unique IDs, valid dates, no level field, detail matches the index`)
  }
}

// ----------------------------------------------------------- 10. verify page
const verifyPath = join(ROOT, 'verify.html')
if (!existsSync(verifyPath)) {
  fail('check 10: verify.html is missing')
} else {
  const verifyHtml = readText(verifyPath)
  if (!/非官方\s*·\s*非认证\s*·\s*非安全审计/.test(verifyHtml)) {
    fail('check 10: verify.html must show 非官方 · 非认证 · 非安全审计 in the same view')
  }
  if (!/INDEX_URL\s*=\s*['"]data\/attestations\.json['"]/.test(verifyHtml)) {
    fail('check 10: verify.html does not read data/attestations.json')
  }
  const blocks = [...verifyHtml.matchAll(/<script>([\s\S]*?)<\/script>/g)]
  if (blocks.length !== 1) {
    fail(`check 10: expected exactly 1 inline <script> block in verify.html, found ${blocks.length}`)
  } else {
    const makeElement = (tag) => ({
      tag,
      className: '',
      textContent: '',
      href: '',
      target: '',
      rel: '',
      title: '',
      children: [],
      appendChild(child) { this.children.push(child); return child },
    })
    const context = {
      console: { warn() {}, log() {}, error() {} },
      document: { createElement: makeElement },
    }
    try {
      vm.createContext(context)
      new vm.Script(`${blocks[0][1]}\n;globalThis.__probe = { classify, findAttestation, recordFor, evidenceLinks, STATUS_TEXT };`).runInContext(context)
      const page = context.__probe
      const now = Date.parse('2026-11-01T12:00:00Z')
      const cases = [
        [{ status: 'active', expiresAt: '2027-01-01' }, 'valid', true],
        [{ status: 'active', expiresAt: '2026-01-01' }, 'stale', false],
        [{ status: 'expired', expiresAt: '2027-01-01' }, 'stale', false],
        [{ status: 'withdrawn', expiresAt: '2027-01-01' }, 'withdrawn', false],
        [{ status: 'withdrawn', expiresAt: '2026-01-01' }, 'withdrawn', false],
        [{ status: 'draft', expiresAt: '2027-01-01' }, 'inactive', false],
      ]
      const problems = []
      for (const [entry, state, valid] of cases) {
        const outcome = page.classify(entry, now)
        if (outcome.state !== state || outcome.valid !== valid) {
          problems.push(`${entry.status} / ${entry.expiresAt}: expected ${state} (valid=${valid}), got ${outcome.state} (valid=${outcome.valid})`)
        }
      }
      const fixture = { attestations: [{ attestationId: 'DSH-ATT-2026-001' }] }
      if (page.findAttestation(fixture, 'dsh-att-2026-001')?.attestationId !== 'DSH-ATT-2026-001') {
        problems.push('findAttestation does not match case-insensitively')
      }
      if (page.findAttestation(fixture, 'unknown') !== null) problems.push('findAttestation returns a record for an unknown id')
      const evidence = page.evidenceLinks({ evidence: [{ id: 'A', result: 'PASS', url: 'https://example.com/a' }] })
      if (!Array.isArray(evidence) || evidence[0]?.tag !== 'a' || evidence[0]?.href !== 'https://example.com/a') {
        problems.push('evidenceLinks does not render an https anchor')
      }
      // The state chip must read `stale`/`withdrawn`, not the declared status.
      if (page.STATUS_TEXT?.stale !== 'stale' || page.STATUS_TEXT?.withdrawn !== 'withdrawn') {
        problems.push('STATUS_TEXT must label the stale and withdrawn states explicitly')
      }
      if (problems.length > 0) for (const problem of problems) fail(`check 10: ${problem}`)
      else ok('check 10: verify.html parses and classifies expired/withdrawn records as stale/withdrawn, never valid')
    } catch (error) {
      fail(`check 10: the verify.html inline script does not parse or run: ${error.message}`)
    }
  }
}

// ----------------------------------------------- 11. index level chip wiring
if (probe !== null && html !== null) {
  const problems = []
  if (typeof probe.levelChips !== 'function') {
    problems.push('levelChips is not reachable from the inline script')
  } else {
    const sample = {
      repo: 'demo',
      entry: { status: 'not-run', evidence: null },
      flow: { status: 'not-run', evidence: null },
      boost: { status: 'not-measured', evidence: null },
    }
    const chips = probe.levelChips(sample)
    const texts = chips && Array.isArray(chips.children) ? chips.children.map((chip) => chip.textContent) : []
    if (!chips || chips.children.length !== 3) {
      problems.push(`a fully not-run record should render 3 chips, got ${chips ? chips.children.length : 'no container'}`)
    }
    for (const expected of ['ENTRY not-run', 'FLOW not-run', 'BOOST not-measured']) {
      if (!texts.includes(expected)) problems.push(`missing chip "${expected}" (got: ${texts.join(', ') || 'none'})`)
    }
    if (probe.levelChips(null) !== null) problems.push('an absent record must render no container (no empty badge)')
    const withEvidence = probe.levelChips({ entry: { status: 'runtime', evidence: { url: 'https://example.com/entry' } } })
    const anchor = withEvidence && withEvidence.children[0]
    if (!anchor || anchor.tag !== 'a' || anchor.href !== 'https://example.com/entry') {
      problems.push('a runtime status with evidence.url should render a link')
    }
    if (!/fetch\(\s*['"]data\/levels\.json['"]\s*\)/.test(html)) problems.push('index.html does not fetch data/levels.json')
    if (!/非官方\s*·\s*非认证\s*·\s*非安全审计/.test(html)) {
      problems.push('index.html shows level labels, so the same-view 非官方/非认证/非安全审计 disclaimer is required')
    }
  }
  if (problems.length > 0) for (const problem of problems) fail(`check 11: ${problem}`)
  else ok('check 11: index.html renders the optional level row from data/levels.json (no empty badges, evidence linked)')
}

// ----------------------------------------------------------------- reporting
for (const message of notices) console.log(`note ${message}`)
if (failures.length > 0) {
  console.error(`\nverify-portal: FAIL (${failures.length})`)
  for (const message of failures) console.error(`  - ${message}`)
  process.exit(1)
}
console.log('\nverify-portal: PASS (roster + inline script + upstream parity + counts + levels + attestations + verify page)')
