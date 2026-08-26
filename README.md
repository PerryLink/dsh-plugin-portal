# dsh-plugin-portal

**PerryLink DSH 插件门户** — a zero-dependency static portal that renders the @perrylink DeepSeek Harness plugin ecosystem as grouped cards, one page, no build step, no runtime framework.

> **English** · 这是一个零依赖的静态门户：单页、无构建步骤、无运行时框架，按分组渲染 @perrylink DeepSeek Harness 插件生态的卡片。

---

## 生态总览 / Ecosystem overview

The portal renders the complete registry tracked by [`dsh-plugin-kit/data/repos.json`](https://github.com/PerryLink/dsh-plugin-kit/blob/main/data/repos.json): **34 entries** (33 plugin repos + the `dsh-plugin-kit` infra repo). Every card shows the repo **name**, a **one-line description**, its **★ count**, two **shields.io badges** (live GitHub stars + a static rating badge), and the **GitHub link**.

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

## License

[Apache License 2.0](LICENSE)
