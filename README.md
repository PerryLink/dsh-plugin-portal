# dsh-plugin-portal

**PerryLink DSH 插件门户** — a zero-dependency static portal that renders the @perrylink DeepSeek Harness plugin ecosystem as grouped cards, one page, no build step, no runtime framework.

> **English** · 这是一个零依赖的静态门户：单页、无构建步骤、无运行时框架，按分组渲染 @perrylink DeepSeek Harness 插件生态的卡片。

---

## 生态总览 / Ecosystem overview

The portal renders the complete registry tracked by [`dsh-plugin-kit/data/repos.json`](https://github.com/PerryLink/dsh-plugin-kit/blob/main/data/repos.json): every roster entry, plugins plus the `dsh-plugin-kit` infra repo. Every card shows the repo **name**, a **one-line description**, its **★ count**, two **shields.io badges** (live GitHub stars + a static rating badge), and the **GitHub link**. The authoritative counts are printed by `node scripts/verify-portal.mjs` (the README deliberately carries no frozen number).
[![dshfind](https://dshfind.com/api/badge/PerryLink/dsh-plugin-portal?metric=downloads)](https://dshfind.com/plugins/PerryLink/dsh-plugin-portal?ref=badge)

本门户渲染 `dsh-plugin-kit/data/repos.json` 记录的完整清单（全部插件仓库 + `dsh-plugin-kit` 基建仓库）。每张卡片展示仓库**名称**、**一句话简介**、**★ 数**、两个 **shields.io 徽章**（实时 GitHub stars + 静态评分徽章）与 **GitHub 链接**。**权威计数由 `node scripts/verify-portal.mjs` 打印**，README 刻意不写死数字。

## 分组导航 / Grouped navigation

Cards are grouped by the roster's `group` field (group → English label):

| 分组 Group | 内容 Contents |
|---|---|
| 基建 Infra | `dsh-plugin-kit` |
| 会话 Session | `dsh-memento`, `dsh-checkpoint-rewind`, `dsh-composer-history`, `dsh-background-agents`, `dsh-session-pin`, `dsh-session-sync` |
| 安全 Security | `dsh-auto-review`, `dsh-permission-rules`, `dsh-defend`, `dsh-mask`, `dsh-skill-pack-security` |
| 质量 Quality | `dsh-doublecheck`, `dsh-data-quality`, `dsh-test-drive`, `dsh-score` |
| 研究 Research | `dsh-industry-research`, `dsh-fund-research`, `dsh-research-report`, `dsh-library` |
| 集成 Integration | `dsh-mcp-panel`, `dsh-claude-move`, `dsh-lsp-actions`, `dsh-local-ai`, `dsh-github`, `dsh-translate` |
| 桌面 Desktop | `dsh-click`, `dsh-talk`, `dsh-draw` |
| 观测 Observability | `dsh-budget`, `dsh-observe`, `dsh-fast` |
| UX | `dsh-output-styles` |
| 生态 Ecosystem | `dsh-plugin-guide` |

Per-group counts are printed by the gate (`node scripts/verify-portal.mjs`) instead of being frozen here.

## P0 状态 / P0 status

P0 — the foundational must-haves for the portal — are **done** for v1:

- **静态门户 v1** ✅ — `index.html` is a single file with inline CSS/JS; zero external runtime dependencies.
- **数据源同步** ✅ — `data/repos.json` is a verbatim copy of `dsh-plugin-kit/data/repos.json` (plus a `_source` sync note).
- **分组渲染 ✅** — one card per roster entry, grouped by `group`.
- **质量徽章** ✅ — live `img.shields.io/github/stars/…` + a static rating badge per card; no self-hosting.

P1/P2 (landed in this revision): read-only adoption-level chips, the mirrored attestation index, and the `verify.html` lookup. Still out of scope: star/rating auto-refresh pipeline, search/filter, per-plugin detail pages, and a self-hosted badge service.

## 质量信号 / Quality signals

Each card surfaces two quality signals: the **★ count** from the roster (synced snapshot) and a **live stars badge** from GitHub via shields.io. The static rating badge reflects the synced `star` value (`n/a` for `dsh-plugin-kit`, which ships no star count). These signals are display-only — the portal does no scoring of its own; scoring lives in `dsh-plugin-kit`.

## 只读展示 / Read-only display

The portal **only displays** adoption levels and attestations: it does **not compute a level**, does **not issue, validate or revoke an attestation**, and is **not an official site, not a certification body, and not a security audit**. 本门户只读展示：不计算 level、不做认证、不做安全审计，也不代表 DeepSeek；没有证据的层显示为 `not-run` / `not-measured`，不显示为通过。

- `data/levels.json` — a read-only projection of the three adoption depths (`entry` / `flow` / `boost`) for every roster repo. An axis without an evidence record is displayed as `not-run` / `not-measured`, never as a pass; cards keep the roster order and are never sorted or weighted by level.
- `data/attestations.json` — a mirror of the standard repository's `publish/attestations/index.json`. `source` points at the upstream path/URL and `records` copies the attestation files referenced by `file`, so the verify page needs no network call. Attestation grades A–D are orthogonal to the levels and are never converted.
- `verify.html` — look up an `attestationId` and read its subject, grade, claimLevel, status, dates, scope, excluded list, disclaimer and evidence links. An expired record renders as `stale` and a withdrawn one as `withdrawn`; neither is ever shown as valid. The page carries the same-view disclaimer 非官方 · 非认证 · 非安全审计.

## 结构与同步 / Layout & sync

```
dsh-plugin-portal/
├── index.html              # 单文件门户（内联 CSS/JS，无外部运行时依赖）
├── verify.html             # attestationId 只读查验（零依赖、静态、无构建）
├── data/repos.json         # 从 dsh-plugin-kit/data/repos.json 复制的清单（见 _source 注释）
├── data/levels.json        # 三层采用深度的只读投影（不计算 level）
├── data/attestations.json  # 标准仓 publish/attestations/index.json 的镜像
├── scripts/verify-portal.mjs # 零依赖门禁（roster + levels + attestations + pages）
├── package.json            # npm test 别名；无依赖、无安装步骤
└── README.md               # 本文件
```

`data/repos.json` is **not** the source of truth: [`dsh-plugin-kit/data/repos.json`](https://github.com/PerryLink/dsh-plugin-kit/blob/main/data/repos.json) owns the roster and star counts. To refresh this portal, re-copy that file over `data/repos.json`.

## 本地预览 / Local preview

Open over HTTP (the pages fetch `data/repos.json`, `data/levels.json` and `data/attestations.json`, which file:// blocks):

```sh
python -m http.server 8080
# then open http://localhost:8080/ and http://localhost:8080/verify.html
```

## 校验 / Validation

No browser and no install step: the gate is zero-dependency and asserts that about itself, so the portal stays runnable from a bare checkout.

```sh
node scripts/verify-portal.mjs   # the gate itself
npm test                         # same gate, no install step (package.json has no dependencies)
```

It prints the authoritative counts (entries, groups, per-group) and checks:

1. the gate imports nothing but `node:` builtins;
2. `data/repos.json` satisfies the roster contract — `name`/`group`/`role`/`star`, an `https://github.com/<owner>/<repo>` URL whose repo segment matches `name`, and no duplicate names;
3. the inline script in `index.html` parses (`new vm.Script`) and runs under a DOM stub;
4. every roster entry has a blurb in `DESCRIPTIONS` and every group a `GROUP_EN` label — an entry whose blurb has not landed yet must be registered in `PENDING_DESCRIPTION` (the deliberate allowlist), otherwise the gate fails;
5. star badges derive their owner from `repo.github`, third-party owners included (`pan17/dsh-wechat`) — no hardcoded owner;
6. `data/repos.json` is a **verbatim copy** of the upstream `dsh-plugin-kit/data/repos.json` except for `_source`, and the sha256 recorded in `_source` still matches that file. On a runner without the sibling kit checkout (CI) this check reports `skip` rather than failing, so the gate is never red for a reason the runner cannot fix;
7. the README does not freeze a count;
8. `data/levels.json` only references roster repos, covers every one of them, uses the per-level status enum, and every `runtime` / `measured` / `manual` status carries an `https` `evidence.url` — `not-run` is never upgraded to a pass;
9. `data/attestations.json` mirrors the standard-repository index with unique `attestationId`s, real `expiresAt` dates, detail for every record, and **no `level` field anywhere** (a grade is orthogonal to an adoption level);
10. `verify.html` parses, shows 非官方 · 非认证 · 非安全审计 in the same view, and classifies an expired or withdrawn record as `stale` / `withdrawn` — never `valid`;
11. `index.html` renders the optional level row from `data/levels.json`, shows `not-run` / `not-measured` rather than an empty badge, and links evidence when a record has one.

Two behaviors worth knowing when reading a card: the star badge owner comes from the roster entry's own `github` URL, and a roster entry with no blurb renders the visible **`description not synced`** marker (accent, italic) plus one `console.warn` instead of silently showing placeholder copy.

## PerryLink DSH Plugin Family

This project is part of the DeepSeek Harness plugin family from [PerryLink](https://github.com/PerryLink). The roster stays collapsed below so every README keeps a short first screen; expand it to see every row and its status.

<details>
<summary>Expand all plugins</summary>

| Plugin | Status |
|---|---|
| **[dsh-aqua-input-check](https://github.com/PerryLink/dsh-aqua-input-check)** |  |
| **[dsh-archive-check](https://github.com/PerryLink/dsh-archive-check)** |  |
| **[dsh-auto-review](https://github.com/PerryLink/dsh-auto-review)** |  |
| **[dsh-autotier](https://github.com/PerryLink/dsh-autotier)** | 🧊 FROZEN — see the repo README |
| **[dsh-bid-ca-precheck](https://github.com/PerryLink/dsh-bid-ca-precheck)** |  |
| **[dsh-bid-qual-check](https://github.com/PerryLink/dsh-bid-qual-check)** |  |
| **[dsh-cert-mcp](https://github.com/PerryLink/dsh-cert-mcp)** | 🧊 FROZEN — see the repo README |
| **[dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind)** |  |
| **[dsh-click](https://github.com/PerryLink/dsh-click)** |  |
| **[dsh-composer-history](https://github.com/PerryLink/dsh-composer-history)** |  |
| **[dsh-contract-stance](https://github.com/PerryLink/dsh-contract-stance)** |  |
| **[dsh-customs-doc-check](https://github.com/PerryLink/dsh-customs-doc-check)** |  |
| **[dsh-data-quality](https://github.com/PerryLink/dsh-data-quality)** |  |
| **[dsh-demurrage-ledger](https://github.com/PerryLink/dsh-demurrage-ledger)** |  |
| **[dsh-doublecheck](https://github.com/PerryLink/dsh-doublecheck)** |  |
| **[dsh-drill-script-check](https://github.com/PerryLink/dsh-drill-script-check)** |  |
| **[dsh-eia-guide-check](https://github.com/PerryLink/dsh-eia-guide-check)** |  |
| **[dsh-emergency-plan](https://github.com/PerryLink/dsh-emergency-plan)** |  |
| **[dsh-essay-rubric-check](https://github.com/PerryLink/dsh-essay-rubric-check)** |  |
| **[dsh-evidence-check](https://github.com/PerryLink/dsh-evidence-check)** |  |
| **[dsh-export-ctl-check](https://github.com/PerryLink/dsh-export-ctl-check)** |  |
| **[dsh-fast](https://github.com/PerryLink/dsh-fast)** |  |
| **[dsh-fmea-table-check](https://github.com/PerryLink/dsh-fmea-table-check)** |  |
| **[dsh-forecast-penalty](https://github.com/PerryLink/dsh-forecast-penalty)** |  |
| **[dsh-fund-research](https://github.com/PerryLink/dsh-fund-research)** |  |
| **[dsh-github](https://github.com/PerryLink/dsh-github)** |  |
| **[dsh-gongwen-flow-check](https://github.com/PerryLink/dsh-gongwen-flow-check)** |  |
| **[dsh-gongwen-word-check](https://github.com/PerryLink/dsh-gongwen-word-check)** |  |
| **[dsh-guard-plan-qc](https://github.com/PerryLink/dsh-guard-plan-qc)** |  |
| **[dsh-hazchem-check](https://github.com/PerryLink/dsh-hazchem-check)** |  |
| **[dsh-hazplan-check](https://github.com/PerryLink/dsh-hazplan-check)** |  |
| **[dsh-hidden-risk-map](https://github.com/PerryLink/dsh-hidden-risk-map)** |  |
| **[dsh-hs-classify](https://github.com/PerryLink/dsh-hs-classify)** |  |
| **[dsh-icd-rule-check](https://github.com/PerryLink/dsh-icd-rule-check)** |  |
| **[dsh-industry-research](https://github.com/PerryLink/dsh-industry-research)** |  |
| **[dsh-lawcite-adapter](https://github.com/PerryLink/dsh-lawcite-adapter)** |  |
| **[dsh-laya](https://github.com/PerryLink/dsh-laya)** |  |
| **[dsh-lc-doc-check](https://github.com/PerryLink/dsh-lc-doc-check)** |  |
| **[dsh-learning-gap-check](https://github.com/PerryLink/dsh-learning-gap-check)** |  |
| **[dsh-library](https://github.com/PerryLink/dsh-library)** |  |
| **[dsh-local-ai](https://github.com/PerryLink/dsh-local-ai)** |  |
| **[dsh-lsp-actions](https://github.com/PerryLink/dsh-lsp-actions)** |  |
| **[dsh-mask](https://github.com/PerryLink/dsh-mask)** |  |
| **[dsh-mcp-panel](https://github.com/PerryLink/dsh-mcp-panel)** |  |
| **[dsh-medrec-qc](https://github.com/PerryLink/dsh-medrec-qc)** |  |
| **[dsh-memento](https://github.com/PerryLink/dsh-memento)** |  |
| **[dsh-nsfc-form-check](https://github.com/PerryLink/dsh-nsfc-form-check)** |  |
| **[dsh-nurse-record-check](https://github.com/PerryLink/dsh-nurse-record-check)** |  |
| **[dsh-observe](https://github.com/PerryLink/dsh-observe)** |  |
| **[dsh-origin-rvc-check](https://github.com/PerryLink/dsh-origin-rvc-check)** |  |
| **[dsh-ota-review-check](https://github.com/PerryLink/dsh-ota-review-check)** |  |
| **[dsh-output-styles](https://github.com/PerryLink/dsh-output-styles)** |  |
| **[dsh-paper-doc-adapter](https://github.com/PerryLink/dsh-paper-doc-adapter)** |  |
| **[dsh-permission-rules](https://github.com/PerryLink/dsh-permission-rules)** |  |
| **[dsh-permit-report-check](https://github.com/PerryLink/dsh-permit-report-check)** |  |
| **[dsh-pipeline-check](https://github.com/PerryLink/dsh-pipeline-check)** |  |
| **[dsh-pleading-draft](https://github.com/PerryLink/dsh-pleading-draft)** |  |
| **[dsh-plugin-doctor](https://github.com/PerryLink/dsh-plugin-doctor)** |  |
| **[dsh-plugin-guide](https://github.com/PerryLink/dsh-plugin-guide)** |  |
| **[dsh-plugin-kit](https://github.com/PerryLink/dsh-plugin-kit)** |  |
| **[dsh-plugin-upgrade](https://github.com/PerryLink/dsh-plugin-upgrade)** |  |
| **[dsh-policy-brief-draft](https://github.com/PerryLink/dsh-policy-brief-draft)** |  |
| **[dsh-power-loss-split](https://github.com/PerryLink/dsh-power-loss-split)** |  |
| **[dsh-power-ticket-check](https://github.com/PerryLink/dsh-power-ticket-check)** |  |
| **[dsh-ppap-check](https://github.com/PerryLink/dsh-ppap-check)** |  |
| **[dsh-protest-deadline](https://github.com/PerryLink/dsh-protest-deadline)** |  |
| **[dsh-railway-window](https://github.com/PerryLink/dsh-railway-window)** |  |
| **[dsh-repair-order-qc](https://github.com/PerryLink/dsh-repair-order-qc)** |  |
| **[dsh-research-report](https://github.com/PerryLink/dsh-research-report)** |  |
| **[dsh-review-reply-check](https://github.com/PerryLink/dsh-review-reply-check)** |  |
| **[dsh-rulefile-check](https://github.com/PerryLink/dsh-rulefile-check)** |  |
| **[dsh-safety-brief-check](https://github.com/PerryLink/dsh-safety-brief-check)** |  |
| **[dsh-score](https://github.com/PerryLink/dsh-score)** |  |
| **[dsh-session-sync](https://github.com/PerryLink/dsh-session-sync)** |  |
| **[dsh-site-log-check](https://github.com/PerryLink/dsh-site-log-check)** |  |
| **[dsh-skill-pack-security](https://github.com/PerryLink/dsh-skill-pack-security)** |  |
| **[dsh-soe-decision-check](https://github.com/PerryLink/dsh-soe-decision-check)** |  |
| **[dsh-soilwater-check](https://github.com/PerryLink/dsh-soilwater-check)** |  |
| **[dsh-sop-sync-check](https://github.com/PerryLink/dsh-sop-sync-check)** |  |
| **[dsh-spc-gbt-adapter](https://github.com/PerryLink/dsh-spc-gbt-adapter)** |  |
| **[dsh-talk](https://github.com/PerryLink/dsh-talk)** |  |
| **[dsh-tender-extract](https://github.com/PerryLink/dsh-tender-extract)** |  |
| **[dsh-tender-matrix](https://github.com/PerryLink/dsh-tender-matrix)** |  |
| **[dsh-test-drive](https://github.com/PerryLink/dsh-test-drive)** |  |
| **[dsh-ticktick](https://github.com/PerryLink/dsh-ticktick)** |  |
| **[dsh-translate](https://github.com/PerryLink/dsh-translate)** |  |
| **[dsh-warranty-calc](https://github.com/PerryLink/dsh-warranty-calc)** |  |
| **[dsh-budget](https://github.com/PerryLink/dsh-budget)** | 🧊 FROZEN — see the repo README |
| **[dsh-claude-move](https://github.com/PerryLink/dsh-claude-move)** | 🧊 FROZEN — see the repo README |
| **[dsh-defend](https://github.com/PerryLink/dsh-defend)** | 🧊 FROZEN — see the repo README |
| **[dsh-draw](https://github.com/PerryLink/dsh-draw)** | 🧊 FROZEN — see the repo README |
| **[dsh-reach](https://github.com/PerryLink/dsh-reach)** | 🧊 FROZEN — see the repo README |
| **[dsh-background-agents](https://github.com/PerryLink/dsh-background-agents)** | 🚫 RETIRED — see the repo README |
| **[dsh-session-pin](https://github.com/PerryLink/dsh-session-pin)** | 🚫 RETIRED — see the repo README |
| **[dsh-team-rooms](https://github.com/PerryLink/dsh-team-rooms)** | 🚫 RETIRED — see the repo README |

</details>

## Adoption levels (non-official)

The ecosystem is moving to three **adoption depths**, not grades: **DSH-ENTRY** (compatibility baseline — can it be installed and booted?), **DSH-FLOW** (recommended usability — can a user install, configure, recover, upgrade and uninstall it?) and **DSH-BOOST** (Cordis practice — is it measurably cheaper?). They are not certification, not a ranking, and not endorsed by DeepSeek.

- Public teaching copy: [dsh-plugin-guide/guide/standards.md](https://github.com/PerryLink/dsh-plugin-guide/blob/main/guide/standards.md)
- `dsh-plugin-doctor` exposes an ENTRY projection in its JSON report; `dsh-plugin-certification` explains why its A–D grades are orthogonal to the levels.
- The machine-readable `spec/levels.json` and the audit tool live in the private `dsh-standards` project (draft; ask the maintainer). This portal does not ship or reimplement that spec: it only renders the labels mirrored in `data/levels.json`, and `verify.html` reads the mirrored attestation index. 本门户只读展示，不计算 level、不做认证。
