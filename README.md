# dsh-plugin-portal

**PerryLink DSH 插件门户** — a zero-dependency static portal that renders the @perrylink DeepSeek Harness plugin ecosystem as grouped cards, one page, no build step, no runtime framework.

> **English** · 这是一个零依赖的静态门户：单页、无构建步骤、无运行时框架，按分组渲染 @perrylink DeepSeek Harness 插件生态的卡片。

---

## 生态总览 / Ecosystem overview

The portal renders the complete registry tracked by [`dsh-plugin-kit/data/repos.json`](https://github.com/PerryLink/dsh-plugin-kit/blob/main/data/repos.json): **34 entries** (33 plugin repos + the `dsh-plugin-kit` infra repo; the catalog itself carries the 40 published packages). Every card shows the repo **name**, a **one-line description**, its **★ count**, two **shields.io badges** (live GitHub stars + a static rating badge), and the **GitHub link**.

本门户渲染 `dsh-plugin-kit/data/repos.json` 记录的完整清单：**34 项**（33 个插件仓库 + `dsh-plugin-kit` 基建仓库）。每张卡片展示仓库**名称**、**一句话简介**、**★ 数**、两个 **shields.io 徽章**（实时 GitHub stars + 静态评分徽章）与 **GitHub 链接**。

## 分组导航 / Grouped navigation

Cards are grouped by the roster's `group` field (group → English label):

| 分组 Group | 数量 Count | 内容 Contents |
|---|---|---|
| 基建 Infra | 1 | `dsh-plugin-kit` |
| 会话 Session | 6 | `dsh-memento`, `dsh-checkpoint-rewind`, `dsh-composer-history`, `dsh-background-agents`, `dsh-session-pin`, `dsh-session-sync` |
| 安全 Security | 5 | `dsh-auto-review`, `dsh-permission-rules`, `dsh-defend`, `dsh-mask`, `dsh-skill-pack-security` |
| 质量 Quality | 4 | `dsh-doublecheck`, `dsh-data-quality`, `dsh-test-drive`, `dsh-score` |
| 研究 Research | 4 | `dsh-industry-research`, `dsh-fund-research`, `dsh-research-report`, `dsh-library` |
| 集成 Integration | 6 | `dsh-mcp-panel`, `dsh-claude-move`, `dsh-lsp-actions`, `dsh-local-ai`, `dsh-github`, `dsh-translate` |
| 桌面 Desktop | 3 | `dsh-click`, `dsh-talk`, `dsh-draw` |
| 观测 Observability | 3 | `dsh-budget`, `dsh-observe`, `dsh-fast` |
| UX | 1 | `dsh-output-styles` |
| 生态 Ecosystem | 1 | `dsh-plugin-guide` |

## P0 状态 / P0 status

P0 — the foundational must-haves for the portal — are **done** for v1:

- **静态门户 v1** ✅ — `index.html` is a single file with inline CSS/JS; zero external runtime dependencies.
- **数据源同步** ✅ — `data/repos.json` is a verbatim copy of `dsh-plugin-kit/data/repos.json` (plus a `_source` sync note).
- **分组渲染 34 卡片** ✅ — one card per roster entry, grouped by `group`.
- **质量徽章** ✅ — live `img.shields.io/github/stars/…` + a static rating badge per card; no self-hosting.

P1/P2 (not yet in scope): star/rating auto-refresh pipeline, search/filter, per-plugin detail pages, and a self-hosted badge service.

## 质量信号 / Quality signals

Each card surfaces two quality signals: the **★ count** from the roster (synced snapshot) and a **live stars badge** from GitHub via shields.io. The static rating badge reflects the synced `star` value (`n/a` for `dsh-plugin-kit`, which ships no star count). These signals are display-only — the portal does no scoring of its own; scoring lives in `dsh-plugin-kit`.

## 结构与同步 / Layout & sync

```
dsh-plugin-portal/
├── index.html        # 单文件门户（内联 CSS/JS，无外部运行时依赖）
├── data/repos.json   # 从 dsh-plugin-kit/data/repos.json 复制的清单（见 _source 注释）
└── README.md         # 本文件
```

`data/repos.json` is **not** the source of truth: [`dsh-plugin-kit/data/repos.json`](https://github.com/PerryLink/dsh-plugin-kit/blob/main/data/repos.json) owns the roster and star counts. To refresh this portal, re-copy that file over `data/repos.json`.

## 本地预览 / Local preview

Open over HTTP (the page fetches `data/repos.json`, which file:// blocks):

```sh
python -m http.server 8080
# then open http://localhost:8080
```

## 校验 / Validation

No browser required. The following asserts the roster count and that the inline script parses:

```sh
node -e "const fs=require('node:fs');const vm=require('node:vm');const repos=JSON.parse(fs.readFileSync('data/repos.json','utf8')).repos;const html=fs.readFileSync('index.html','utf8');const m=html.match(/<script>([\s\S]*?)<\/script>/);if(!m)throw new Error('no inline script');new vm.Script(m[1]);console.log('repos.json entries:',repos.length);console.log('inline JS parses: OK');if(repos.length!==34)throw new Error('expected 34 repos')"
```

## PerryLink DSH Plugin Family

This project is one of the [40 DeepSeek Harness plugins](https://github.com/PerryLink) maintained by [PerryLink](https://github.com/PerryLink). If this one helps you, the others likely will too:

| Plugin | One-liner |
|---|---|
| **[dsh-auto-review](https://github.com/PerryLink/dsh-auto-review)** | Second-model auto-review on the approval chain, fail-closed by default | |
| **[dsh-autotier](https://github.com/PerryLink/dsh-autotier)** | Automatic strong/cheap model-tier routing with deterministic risk guards and a `/tier` command | |
| **[dsh-background-agents](https://github.com/PerryLink/dsh-background-agents)** | Durable background child agents with a Web UI sidebar, messaging and interrupt | |
| **[dsh-budget](https://github.com/PerryLink/dsh-budget)** | Cost governance for DeepSeek Harness: budgets, carbon, and latency in one panel. | |
| **[dsh-catalog](https://github.com/PerryLink/dsh-catalog)** | DSH Desktop Market standard catalog source for the PerryLink family | |
| **[dsh-cert-mcp](https://github.com/PerryLink/dsh-cert-mcp)** | Read-only MCP server exposing the certification registry: grades, snapshots and five-dimension evidence | |
| **[dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind)** | Unified session + workspace + config checkpoints with one-shot `/rewind` | |
| **[dsh-claude-move](https://github.com/PerryLink/dsh-claude-move)** | Migrate Claude Code, Codex, OpenCode and Hermes sessions, memories and skills into DSH | |
| **[dsh-click](https://github.com/PerryLink/dsh-click)** | Cross-platform native desktop control for DeepSeek Harness — Windows first. | |
| **[dsh-composer-history](https://github.com/PerryLink/dsh-composer-history)** | Terminal-style input history for the web composer: arrows, Ctrl+R search | |
| **[dsh-data-quality](https://github.com/PerryLink/dsh-data-quality)** | Deterministic dataset profiling, cleaning and citation verification | |
| **[dsh-defend](https://github.com/PerryLink/dsh-defend)** | Prompt-injection, jailbreak, and secret-leak defense for DeepSeek Harness. | |
| **[dsh-doublecheck](https://github.com/PerryLink/dsh-doublecheck)** | Engineering-discipline guard: requirements grill, test gates, adversary review | |
| **[dsh-draw](https://github.com/PerryLink/dsh-draw)** | Unified static-image generation routing for DeepSeek Harness. | |
| **[dsh-fast](https://github.com/PerryLink/dsh-fast)** | Read-only performance diagnostics: load, spill, compaction and cache hit rate | |
| **[dsh-fund-research](https://github.com/PerryLink/dsh-fund-research)** | Chinese mutual-fund research with sealed, traceable source snapshots | |
| **[dsh-github](https://github.com/PerryLink/dsh-github)** | GitHub PR/issue/CI integration with every write approval-gated | |
| **[dsh-industry-research](https://github.com/PerryLink/dsh-industry-research)** | Industry and company research pack: chain map, policy timeline, company cards | |
| **[dsh-kit](https://github.com/PerryLink/dsh-kit)** | One-command starter pack that installs the core family | |
| **[dsh-library](https://github.com/PerryLink/dsh-library)** | Local document knowledge base with hybrid search and citation-aware injection | |
| **[dsh-local-ai](https://github.com/PerryLink/dsh-local-ai)** | Local Ollama model discovery and task-based routing with cloud fallback | |
| **[dsh-lsp-actions](https://github.com/PerryLink/dsh-lsp-actions)** | LSP diagnostics, formatting, completion, code actions, symbols and rename | |
| **[dsh-mask](https://github.com/PerryLink/dsh-mask)** | PII masking at the model boundary with a host-side restore table | |
| **[dsh-mcp-panel](https://github.com/PerryLink/dsh-mcp-panel)** | MCP management console: `/mcp` command, Settings tab and trial calls | |
| **[dsh-memento](https://github.com/PerryLink/dsh-memento)** | Approval-gated cross-session memory protocol (`ctx.memory` + SQLite) | |
| **[dsh-observe](https://github.com/PerryLink/dsh-observe)** | OpenTelemetry and Langfuse telemetry export from the session event stream | |
| **[dsh-output-styles](https://github.com/PerryLink/dsh-output-styles)** | Runtime-switchable model output styles | |
| **[dsh-permission-rules](https://github.com/PerryLink/dsh-permission-rules)** | Declarative allow/deny/ask rules plus a process-level network policy | |
| **[dsh-plugin-certification](https://github.com/PerryLink/dsh-plugin-certification)** | Community certification registry with repro-checkable grades and badges | |
| **[dsh-plugin-doctor](https://github.com/PerryLink/dsh-plugin-doctor)** | Zero-dependency static + sandbox smoke detector for DSH plugins | |
| **[dsh-plugin-guide](https://github.com/PerryLink/dsh-plugin-guide)** | Plugin-dev knowledge base, agent skill and the `dsh-plugin-dev` CLI toolchain | |
| **[dsh-plugin-kit](https://github.com/PerryLink/dsh-plugin-kit)** | Shared zero-runtime-dependency toolkit for the PerryLink DSH plugins | |
| **[dsh-plugin-upgrade-015](https://github.com/PerryLink/dsh-plugin-upgrade-015)** | Merged `0.1.3-alpha.1` → `0.1.5-rc.1` upgrade corridor card plus a zero-dependency seam scanner | |
| **[dsh-reach](https://github.com/PerryLink/dsh-reach)** | Multi-channel approval/question bridge: WeChat, Telegram, Feishu + a session console | |
| **[dsh-research-report](https://github.com/PerryLink/dsh-research-report)** | Verifiable research reports: evidence ledger, manifest seal, per-claim verdicts | |
| **[dsh-score](https://github.com/PerryLink/dsh-score)** | Multi-dimensional plugin quality scoring with an evidence-backed leaderboard | |
| **[dsh-session-pin](https://github.com/PerryLink/dsh-session-pin)** | Pin sessions and workspaces in the Web sidebar with per-pin colors | |
| **[dsh-session-sync](https://github.com/PerryLink/dsh-session-sync)** | Git-backed cross-device session synchronization with keep-both merges | |
| **[dsh-skill-pack-security](https://github.com/PerryLink/dsh-skill-pack-security)** | Security-audit skill pack plus the `plugin_vet` supply-chain gate | |
| **[dsh-talk](https://github.com/PerryLink/dsh-talk)** | Voice-first session loop: speech-to-text input and text-to-speech replies | |
| **[dsh-team-rooms](https://github.com/PerryLink/dsh-team-rooms)** | Cross-session team rooms: shared message bus, task board and timeline | |
| **[dsh-test-drive](https://github.com/PerryLink/dsh-test-drive)** | Isolated install-and-smoke test drives with a pass/fail matrix | |
| **[dsh-ticktick](https://github.com/PerryLink/dsh-ticktick)** | TickTick/Dida365 task bridge: session-header panel plus eleven agent tools | |
| **[dsh-translate](https://github.com/PerryLink/dsh-translate)** | Vendor parameter translation and deterministic JSON repair | |
| **[dsh-wechat](https://github.com/pan17/dsh-wechat)** | WeChat ↔ DSH bridge (Tencent iLink bot) developed with [pan17](https://github.com/pan17/dsh-wechat), who hosts the repo | |
| **[dsh-personal-directive](https://github.com/PerryLink/dsh-personal-directive)** | Personal directive injector with a top-bar toggle (fork of liucai2026/dsh-personal-directive) | |

## License

[Apache License 2.0](LICENSE)
