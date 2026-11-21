<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/assets/dsh-plugin-portal-hero-zh-dark.webp">
  <img src="docs/assets/dsh-plugin-portal-hero-zh-light.webp" width="100%" alt="dsh-plugin-portal：一页看完整插件生态 —— data/repos.json 提供 99 张 roster 卡片、分入 18 个分组，index.html 单文件内联 CSS/JS、无构建步骤，verify.html 只读查验 attestationId 记录，计数由 node scripts/verify-portal.mjs 打印">
</picture>

# dsh-plugin-portal

[English](README.md) · [简体中文](README-zh.md) · [Español](README-es.md) · [Português](README-pt.md) · [हिन्दी](README-hi.md)

</div>

**PerryLink DSH 插件门户** —— 一个零依赖的静态门户，把 @perrylink 的 DeepSeek Harness 插件生态渲染成分组卡片：单页、无构建步骤、无运行时框架。

> **简体中文** · 这是一个零依赖的静态门户：单页、无构建步骤、无运行时框架，按分组渲染 @perrylink DeepSeek Harness 插件生态的卡片。

---

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/assets/dsh-plugin-portal-flow-v5-dark.svg">
  <img src="docs/assets/dsh-plugin-portal-flow-v5-light.svg" width="100%" alt="dsh-plugin-portal 结构图：dsh-kit/data/repos.json 逐字复制为 data/repos.json（附 _source sha256）；index.html 渲染 99 张分组卡片，verify.html 离线读取 data/levels.json 与镜像的 data/attestations.json；node scripts/verify-portal.mjs 零依赖运行 check 1 到 11 并打印计数">
</picture>

*结构：data/repos.json → index.html / verify.html → 门禁。图中的标注都是真实路径、文件名与门禁命令，因此一张图能服务全部五种语言。*

## 生态总览

![dsh-plugin-portal 真实终端运行 node scripts/verify-portal.mjs（纯净检出）：check 1、2、4、9 通过，check 6 因无同级 dsh-kit 而 skip，计数显示 99 条 roster、18 个分组，最后 verify-portal: PASS](docs/assets/dsh-plugin-portal-demo.gif)

*动图：从纯净检出执行 node scripts/verify-portal.mjs 于 2026-11-21 的复跑——check 6 因同级 dsh-kit 缺席而 skip，与 CI runner 上完全一致。真实 stdout，不联网。*

门户渲染 [`dsh-kit/data/repos.json`](https://github.com/PerryLink/dsh-kit/blob/main/data/repos.json) 记录的完整清单：每一个名册条目，即全部插件加上 `dsh-scaffold` 基建仓库。每张卡片展示仓库**名称**、**一句话简介**、**★ 数**、两个 **shields.io 徽章**（实时 GitHub 星标 + 一个静态评分徽章）以及 **GitHub 链接**。权威计数由 `node scripts/verify-portal.mjs` 打印（README 刻意不携带任何冻结数字）。
[![dshfind](https://dshfind.com/api/badge/PerryLink/dsh-plugin-portal?metric=downloads)](https://dshfind.com/plugins/PerryLink/dsh-plugin-portal?ref=badge)
[![npm](https://img.shields.io/npm/v/dsh-plugin-portal)](https://www.npmjs.com/package/dsh-plugin-portal)
[![CI](https://github.com/PerryLink/dsh-plugin-portal/actions/workflows/ci.yml/badge.svg)](https://github.com/PerryLink/dsh-plugin-portal/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)

## 分组导航

卡片按 roster 的 `group` 字段分组（分组键 → 英文标签）：

| 分组 Group | 内容 Contents |
|---|---|
| 基建 Infra | `dsh-scaffold` |
| 质量 Quality | `dsh-check-pack`, `dsh-doublecheck`, `dsh-data-quality`, `dsh-test-drive`, `dsh-score`, `dsh-fmea-table-check`, `dsh-ota-review-check`, `dsh-pipeline-check`, `dsh-ppap-check`, `dsh-repair-order-qc`, `dsh-review-reply-check`, `dsh-spc-gbt-adapter`, `dsh-warranty-calc` |
| 生态 Ecosystem | `dsh-community-bench`, `dsh-primer`, `dsh-cert-mcp`, `dsh-clinic`, `dsh-codemod` |
| 会话 Session | `dsh-memento`, `dsh-checkpoint-rewind`, `dsh-composer-history`, `dsh-background-agents`, `dsh-session-pin`, `dsh-session-sync`, `dsh-team-rooms` |
| 研究 Research | `dsh-phocinae`, `dsh-industry-research`, `dsh-fund-research`, `dsh-research-report`, `dsh-library`, `dsh-essay-rubric-check`, `dsh-learning-gap-check`, `dsh-nsfc-form-check`, `dsh-paper-doc-adapter`, `dsh-policy-brief-draft` |
| 集成 Integration | `dsh-phone-inbox`, `dsh-mcp-panel`, `dsh-claude-move`, `dsh-lsp-actions`, `dsh-local-ai`, `dsh-github-bot`, `dsh-autotier`, `dsh-laya`, `dsh-reach`, `dsh-dida` |
| 安全 Security | `dsh-auto-review`, `dsh-permission-rules`, `dsh-defend`, `dsh-mask`, `dsh-security-pack`, `dsh-aqua-input-check`, `dsh-drill-script-check`, `dsh-emergency-plan`, `dsh-hazchem-check`, `dsh-hidden-risk-map`, `dsh-power-loss-split`, `dsh-power-ticket-check` |
| 开发工具 Developer tools | `dsh-param-repair` |
| 桌面 Desktop | `dsh-click`, `dsh-talk`, `dsh-draw` |
| 观测 Observability | `dsh-budget`, `dsh-observe`, `dsh-fast` |
| UX | `dsh-output-styles` |
| 公文 Official Documents | `dsh-archive-check`, `dsh-gongwen-flow-check`, `dsh-gongwen-word-check` |
| 招投标 Tendering | `dsh-bid-ca-precheck`, `dsh-bid-qual-check`, `dsh-contract-stance`, `dsh-protest-deadline`, `dsh-rulefile-check`, `dsh-tender-extract`, `dsh-tender-matrix` |
| 外贸 Foreign Trade | `dsh-customs-doc-check`, `dsh-demurrage-ledger`, `dsh-export-ctl-check`, `dsh-forecast-penalty`, `dsh-hs-classify`, `dsh-lc-doc-check`, `dsh-origin-rvc-check`, `dsh-railway-window` |
| 工程建设 Construction | `dsh-eia-guide-check`, `dsh-guard-plan-qc`, `dsh-hazplan-check`, `dsh-permit-report-check`, `dsh-safety-brief-check`, `dsh-site-log-check`, `dsh-soilwater-check` |
| 法律 Legal | `dsh-evidence-check`, `dsh-lawcite-adapter`, `dsh-pleading-draft` |
| 医疗 Medical | `dsh-icd-rule-check`, `dsh-medrec-qc`, `dsh-nurse-record-check` |
| 治理 Governance | `dsh-soe-decision-check`, `dsh-sop-sync-check` |

每组数量由门禁（`node scripts/verify-portal.mjs`）打印，而不是冻结在这里。

## P0 状态

P0——门户的基础必备项——在 v1 已**完成**：

- **静态门户 v1** ✅ —— `index.html` 是单文件，内联 CSS/JS；零外部运行时依赖。
- **数据源同步** ✅ —— `data/repos.json` 是 `dsh-kit/data/repos.json` 的逐字副本（外加一条 `_source` 同步说明）。
- **分组渲染** ✅ —— 每个名册条目一张卡片，按 `group` 分组。
- **质量徽章** ✅ —— 实时 `img.shields.io/github/stars/…` + 每张卡片一个静态评分徽章；无自托管。

P1/P2（本次修订已落地）：只读的采用等级 chips、镜像的认证索引，以及 `verify.html` 查验。仍不在范围内：星标/评分自动刷新流水线、搜索/筛选、逐插件详情页，以及自托管徽章服务。

## 质量信号

每张卡片展示两个质量信号：来自名册（同步快照）的 **★ 数**，以及经 shields.io 从 GitHub 取到的**实时星标徽章**。静态评分徽章反映同步的 `star` 值。这些信号只用于展示——门户自身不做任何评分；评分住在 `dsh-kit`。

## 只读展示

门户**只展示**采用等级与认证：它**不计算等级**，**不签发、不校验、不撤销认证**，并且**不是官方网站、不是认证机构、也不是安全审计**，也不代表 DeepSeek；没有证据的层显示为 `not-run` / `not-measured`，不显示为通过。

- `data/levels.json` —— 对每个名册仓库的三层采用深度（`entry` / `flow` / `boost`）的只读投影。没有证据记录的轴显示为 `not-run` / `not-measured`，绝不显示为通过；卡片保持名册顺序，绝不按等级排序或加权。
- `data/attestations.json` —— 标准仓库 `publish/attestations/index.json` 的镜像。`source` 指向上游路径/URL，`records` 复制 `file` 引用的认证文件，因此查验页面无需联网。认证等级 A–D 与采用等级正交，绝不换算。
- `verify.html` —— 按 `attestationId` 查询并阅读其 subject、grade、claimLevel、status、日期、scope、排除清单、免责声明与证据链接。过期记录渲染为 `stale`，撤回记录渲染为 `withdrawn`；两者都绝不显示为有效。页面带有同视口免责声明 非官方 · 非认证 · 非安全审计。

## 结构与同步

```
dsh-plugin-portal/
├── index.html              # 单文件门户（内联 CSS/JS，无外部运行时依赖）
├── verify.html             # attestationId 只读查验（零依赖、静态、无构建）
├── data/repos.json         # 从 dsh-kit/data/repos.json 复制的清单（见 _source 注释）
├── data/levels.json        # 三层采用深度的只读投影（不计算 level）
├── data/attestations.json  # 标准仓 publish/attestations/index.json 的镜像
├── scripts/verify-portal.mjs # 零依赖门禁（roster + levels + attestations + pages）
├── package.json            # npm test 别名；无依赖、无安装步骤
└── README.md               # 本文件
```

`data/repos.json` **不是**真源：[`dsh-kit/data/repos.json`](https://github.com/PerryLink/dsh-kit/blob/main/data/repos.json) 拥有名册与星数。要刷新本门户，重新把那个文件复制到 `data/repos.json`。

## 本地预览

用 HTTP 打开（页面会 fetch `data/repos.json`、`data/levels.json` 与 `data/attestations.json`，`file://` 会被拦）：

```sh
python -m http.server 8080
# then open http://localhost:8080/ and http://localhost:8080/verify.html
```

## 校验

无需浏览器、无需安装步骤：门禁是零依赖的，并且对这一点本身做出断言，因此门户可以始终从纯净检出直接运行。

```sh
node scripts/verify-portal.mjs   # the gate itself
npm test                         # same gate, no install step (package.json has no dependencies)
```

它会打印权威计数（条目、分组、每组）并执行以下检查：

1. 门禁除 `node:` 内置模块外不导入任何东西；
2. `data/repos.json` 满足名册契约——`name`/`group`/`role`/`star`、一个 `https://github.com/<owner>/<repo>` URL 且其 repo 段与 `name` 匹配、没有重名；
3. `index.html` 的内联脚本可以解析（`new vm.Script`）并在 DOM stub 下运行；
4. 每个名册条目在 `DESCRIPTIONS` 中都有简介，每个分组都有 `GROUP_EN` 标签——简介尚未落地的条目必须登记在 `PENDING_DESCRIPTION`（刻意的允许清单）中，否则门禁失败；
5. 星标徽章的 owner 从 `repo.github` 派生，包含第三方 owner（`pan17/dsh-wechat`）——没有硬编码的 owner；
6. `data/repos.json` 除 `_source` 外是上游 `dsh-kit/data/repos.json` 的**逐字副本**，且 `_source` 中记录的 sha256 仍与该文件匹配。在没有同级 kit 检出的 runner（CI）上，该检查报告 `skip` 而不是失败，因此门禁绝不会因为 runner 无法修复的原因变红；
7. README 不冻结任何计数；
8. `data/levels.json` 只引用名册仓库、覆盖其中每一个、使用每级的状态枚举，且每个 `runtime` / `measured` / `manual` 状态都带 `https` 的 `evidence.url`——`not-run` 绝不升级为通过；
9. `data/attestations.json` 镜像标准仓库索引，`attestationId` 唯一、`expiresAt` 为真实日期、每条记录都有详情，并且**任何地方都没有 `level` 字段**（等级与采用深度正交）；
10. `verify.html` 可以解析，在同一视图中显示 非官方 · 非认证 · 非安全审计，并把过期或撤回的记录归类为 `stale` / `withdrawn`——绝不归类为 `valid`；
11. `index.html` 从 `data/levels.json` 渲染可选的等级行，显示 `not-run` / `not-measured` 而非空徽章，并在记录带证据时链接证据。

读卡片时有两个值得知道的行为：星标徽章的 owner 来自名册条目自己的 `github` URL；没有简介的名册条目会渲染可见的 **`description not synced`** 标记（强调色、斜体）并输出一条 `console.warn`，而不是静默显示占位文案。

## PerryLink DSH 插件家族

本项目是 [PerryLink](https://github.com/PerryLink) 的 DeepSeek Harness 插件家族的一部分。完整的分组索引——标准与检查、指南、开发者工具链、运行时插件、53 项检查器的合规套件、领域运营、目录，以及独立的 Phocinae 决策线——见 [FAMILY.md](https://github.com/PerryLink/PerryLink/blob/main/FAMILY.md)。名册默认折叠在下方，让每份 README 都保持简短首屏；展开即可看到每一行及其状态。

<details>
<summary>展开全部插件</summary>

| 插件 | 状态 |
|---|---|
| **[dsh-aqua-input-check](https://github.com/PerryLink/dsh-aqua-input-check)** |  |
| **[dsh-archive-check](https://github.com/PerryLink/dsh-archive-check)** |  |
| **[dsh-auto-review](https://github.com/PerryLink/dsh-auto-review)** |  |
| **[dsh-bid-ca-precheck](https://github.com/PerryLink/dsh-bid-ca-precheck)** |  |
| **[dsh-bid-qual-check](https://github.com/PerryLink/dsh-bid-qual-check)** |  |
| **[dsh-check-pack](https://github.com/PerryLink/dsh-check-pack)** |  |
| **[dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind)** |  |
| **[dsh-click](https://github.com/PerryLink/dsh-click)** |  |
| **[dsh-clinic](https://github.com/PerryLink/dsh-clinic)** |  |
| **[dsh-codemod](https://github.com/PerryLink/dsh-codemod)** |  |
| **[dsh-composer-history](https://github.com/PerryLink/dsh-composer-history)** |  |
| **[dsh-contract-stance](https://github.com/PerryLink/dsh-contract-stance)** |  |
| **[dsh-customs-doc-check](https://github.com/PerryLink/dsh-customs-doc-check)** |  |
| **[dsh-data-quality](https://github.com/PerryLink/dsh-data-quality)** |  |
| **[dsh-demurrage-ledger](https://github.com/PerryLink/dsh-demurrage-ledger)** |  |
| **[dsh-dida](https://github.com/PerryLink/dsh-dida)** |  |
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
| **[dsh-github-bot](https://github.com/PerryLink/dsh-github-bot)** |  |
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
| **[dsh-param-repair](https://github.com/PerryLink/dsh-param-repair)** |  |
| **[dsh-permission-rules](https://github.com/PerryLink/dsh-permission-rules)** |  |
| **[dsh-permit-report-check](https://github.com/PerryLink/dsh-permit-report-check)** |  |
| **[dsh-phocinae](https://github.com/PerryLink/dsh-phocinae)** |  |
| **[dsh-phone-inbox](https://github.com/PerryLink/dsh-phone-inbox)** |  |
| **[dsh-pipeline-check](https://github.com/PerryLink/dsh-pipeline-check)** |  |
| **[dsh-pleading-draft](https://github.com/PerryLink/dsh-pleading-draft)** |  |
| **[dsh-policy-brief-draft](https://github.com/PerryLink/dsh-policy-brief-draft)** |  |
| **[dsh-power-loss-split](https://github.com/PerryLink/dsh-power-loss-split)** |  |
| **[dsh-power-ticket-check](https://github.com/PerryLink/dsh-power-ticket-check)** |  |
| **[dsh-ppap-check](https://github.com/PerryLink/dsh-ppap-check)** |  |
| **[dsh-primer](https://github.com/PerryLink/dsh-primer)** |  |
| **[dsh-protest-deadline](https://github.com/PerryLink/dsh-protest-deadline)** |  |
| **[dsh-railway-window](https://github.com/PerryLink/dsh-railway-window)** |  |
| **[dsh-repair-order-qc](https://github.com/PerryLink/dsh-repair-order-qc)** |  |
| **[dsh-research-report](https://github.com/PerryLink/dsh-research-report)** |  |
| **[dsh-review-reply-check](https://github.com/PerryLink/dsh-review-reply-check)** |  |
| **[dsh-rulefile-check](https://github.com/PerryLink/dsh-rulefile-check)** |  |
| **[dsh-safety-brief-check](https://github.com/PerryLink/dsh-safety-brief-check)** |  |
| **[dsh-scaffold](https://github.com/PerryLink/dsh-scaffold)** |  |
| **[dsh-score](https://github.com/PerryLink/dsh-score)** |  |
| **[dsh-security-pack](https://github.com/PerryLink/dsh-security-pack)** |  |
| **[dsh-session-sync](https://github.com/PerryLink/dsh-session-sync)** |  |
| **[dsh-site-log-check](https://github.com/PerryLink/dsh-site-log-check)** |  |
| **[dsh-soe-decision-check](https://github.com/PerryLink/dsh-soe-decision-check)** |  |
| **[dsh-soilwater-check](https://github.com/PerryLink/dsh-soilwater-check)** |  |
| **[dsh-sop-sync-check](https://github.com/PerryLink/dsh-sop-sync-check)** |  |
| **[dsh-spc-gbt-adapter](https://github.com/PerryLink/dsh-spc-gbt-adapter)** |  |
| **[dsh-talk](https://github.com/PerryLink/dsh-talk)** |  |
| **[dsh-tender-extract](https://github.com/PerryLink/dsh-tender-extract)** |  |
| **[dsh-tender-matrix](https://github.com/PerryLink/dsh-tender-matrix)** |  |
| **[dsh-test-drive](https://github.com/PerryLink/dsh-test-drive)** |  |
| **[dsh-warranty-calc](https://github.com/PerryLink/dsh-warranty-calc)** |  |
| **[dsh-autotier](https://github.com/PerryLink/dsh-autotier)** | 🧊 已冻结 — 见仓库 README |
| **[dsh-budget](https://github.com/PerryLink/dsh-budget)** | 🧊 已冻结 — 见仓库 README |
| **[dsh-cert-mcp](https://github.com/PerryLink/dsh-cert-mcp)** | 🧊 已冻结 — 见仓库 README |
| **[dsh-claude-move](https://github.com/PerryLink/dsh-claude-move)** | 🧊 已冻结 — 见仓库 README |
| **[dsh-community-bench](https://github.com/PerryLink/dsh-community-bench)** | 🧊 已冻结 — 见仓库 README |
| **[dsh-defend](https://github.com/PerryLink/dsh-defend)** | 🧊 已冻结 — 见仓库 README |
| **[dsh-draw](https://github.com/PerryLink/dsh-draw)** | 🧊 已冻结 — 见仓库 README |
| **[dsh-reach](https://github.com/PerryLink/dsh-reach)** | 🧊 已冻结 — 见仓库 README |
| **[dsh-background-agents](https://github.com/PerryLink/dsh-background-agents)** | 🚫 已退役 — 见仓库 README |
| **[dsh-session-pin](https://github.com/PerryLink/dsh-session-pin)** | 🚫 已退役 — 见仓库 README |
| **[dsh-team-rooms](https://github.com/PerryLink/dsh-team-rooms)** | 🚫 已退役 — 见仓库 README |

</details>

## 采用深度（非官方）

生态正在转向三种**采用深度**，而不是等级：**DSH-ENTRY**（兼容基线——能否安装并启动？）、**DSH-FLOW**（推荐可用性——用户能否安装、配置、恢复、升级与卸载？）与 **DSH-BOOST**（Cordis 实践——能否测得成本更低？）。它们不是认证、不是排名，也不代表 DeepSeek 背书。

- 公开教学副本：[dsh-plugin-guide/guide/standards.md](https://github.com/PerryLink/dsh-plugin-guide/blob/main/guide/standards.md)
- `dsh-plugin-doctor` 在其 JSON 报告中给出 ENTRY 投影；`dsh-plugin-certification` 解释了为什么它的 A–D 等级与这些层级正交。
- 机器可读的 `spec/levels.json` 与审计工具位于私有的 `dsh-standards` 项目（草案；请向维护者索取）。本门户不发布也不重新实现该 spec：它只渲染 `data/levels.json` 中镜像的标签，`verify.html` 读取镜像的认证索引。本门户只读展示，不计算 level、不做认证。
