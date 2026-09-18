# dsh-plugin-portal

**PerryLink DSH 插件门户** — a zero-dependency static portal that renders the @perrylink DeepSeek Harness plugin ecosystem as grouped cards, one page, no build step, no runtime framework.

> **English** · 这是一个零依赖的静态门户：单页、无构建步骤、无运行时框架，按分组渲染 @perrylink DeepSeek Harness 插件生态的卡片。

---

## 生态总览 / Ecosystem overview

The portal renders the complete registry tracked by [`dsh-plugin-kit/data/repos.json`](https://github.com/PerryLink/dsh-plugin-kit/blob/main/data/repos.json): every roster entry, plugins plus the `dsh-plugin-kit` infra repo. Every card shows the repo **name**, a **one-line description**, its **★ count**, two **shields.io badges** (live GitHub stars + a static rating badge), and the **GitHub link**. The authoritative counts are printed by `node scripts/verify-portal.mjs` (the README deliberately carries no frozen number).

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

No browser and no install step: the gate is zero-dependency and asserts that about itself, so the portal stays runnable from a bare checkout.

```sh
node scripts/verify-portal.mjs
```

It prints the authoritative counts (entries, groups, per-group) and checks:

1. the gate imports nothing but `node:` builtins;
2. `data/repos.json` satisfies the roster contract — `name`/`group`/`role`/`star`, an `https://github.com/<owner>/<repo>` URL whose repo segment matches `name`, and no duplicate names;
3. the inline script in `index.html` parses (`new vm.Script`) and runs under a DOM stub;
4. every roster entry has a blurb in `DESCRIPTIONS` and every group a `GROUP_EN` label — an entry whose blurb has not landed yet must be registered in `PENDING_DESCRIPTION` (the deliberate allowlist), otherwise the gate fails;
5. star badges derive their owner from `repo.github`, third-party owners included (`pan17/dsh-wechat`) — no hardcoded owner;
6. `data/repos.json` is a **verbatim copy** of the upstream `dsh-plugin-kit/data/repos.json` except for `_source`, and the sha256 recorded in `_source` still matches that file. On a runner without the sibling kit checkout (CI) this check reports `skip` rather than failing, so the gate is never red for a reason the runner cannot fix;
7. the README does not freeze a count.

Two behaviors worth knowing when reading a card: the star badge owner comes from the roster entry's own `github` URL, and a roster entry with no blurb renders the visible **`description not synced`** marker (accent, italic) plus one `console.warn` instead of silently showing placeholder copy.

## License

[Apache License 2.0](LICENSE)
