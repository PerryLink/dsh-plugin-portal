<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/assets/dsh-plugin-portal-hero-en-dark.webp">
  <img src="docs/assets/dsh-plugin-portal-hero-en-light.webp" width="100%" alt="dsh-plugin-portal: uma página estática para o ecossistema de plugins — data/repos.json alimenta 99 cartões do roster em 18 grupos, index.html traz CSS/JS inline sem etapa de build, verify.html consulta registros attestationId somente leitura e node scripts/verify-portal.mjs imprime as contagens">
</picture>

# dsh-plugin-portal

[English](README.md) · [简体中文](README-zh.md) · [Español](README-es.md) · [Português](README-pt.md) · [हिन्दी](README-hi.md)

</div>

**Portal de plugins PerryLink DSH** — um portal estático sem dependências que renderiza o ecossistema de plugins da @perrylink DeepSeek Harness como cartões agrupados: uma única página, sem etapa de build e sem framework em runtime.

> Portal estático sem dependências: uma página só, sem etapa de build e sem framework em runtime, com o ecossistema de plugins da @perrylink DeepSeek Harness renderizado como cartões agrupados.

---

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/assets/dsh-plugin-portal-flow-v5-dark.svg">
  <img src="docs/assets/dsh-plugin-portal-flow-v5-light.svg" width="100%" alt="Diagrama de estrutura do dsh-plugin-portal: dsh-kit/data/repos.json é copiado literalmente para data/repos.json (com um sha256 em _source); index.html renderiza 99 cartões agrupados enquanto verify.html lê data/levels.json e o espelho data/attestations.json offline; node scripts/verify-portal.mjs executa as verificações 1 a 11 sem dependências e imprime as contagens">
</picture>

*Estrutura: data/repos.json → index.html / verify.html → portão. Os rótulos do diagrama são caminhos, nomes de arquivo e o comando do portão reais, então uma única imagem serve aos cinco idiomas.*

## Visão geral do ecossistema

![dsh-plugin-portal: execução real no terminal de node scripts/verify-portal.mjs em um checkout limpo — as verificações 1, 2, 4 e 9 passam, a 6 é omitida sem o checkout irmão dsh-plugin-kit, as contagens mostram 99 entradas em 18 grupos e o portão termina com verify-portal: PASS](docs/assets/dsh-plugin-portal-demo.gif)

*Animado: node scripts/verify-portal.mjs reexecutado em 2026-11-21 a partir de um checkout limpo — a verificação 6 é omitida porque o checkout irmão dsh-plugin-kit está ausente, exatamente como em um runner de CI. stdout real, sem chamadas de rede.*

O portal renderiza o registro completo rastreado por [`dsh-plugin-kit/data/repos.json`](https://github.com/PerryLink/dsh-plugin-kit/blob/main/data/repos.json): cada entrada do roster, os plugins mais o repositório de infraestrutura `dsh-plugin-kit`. Cada cartão mostra o **nome** do repo, uma **descrição de uma linha**, seu **número de ★**, dois **badges do shields.io** (estrelas do GitHub ao vivo + um badge de avaliação estático) e o **link do GitHub**. As contagens autoritativas são impressas por `node scripts/verify-portal.mjs` (o README evita deliberadamente congelar um número).
[![dshfind](https://dshfind.com/api/badge/PerryLink/dsh-plugin-portal?metric=downloads)](https://dshfind.com/plugins/PerryLink/dsh-plugin-portal?ref=badge)
[![npm](https://img.shields.io/npm/v/dsh-plugin-portal)](https://www.npmjs.com/package/dsh-plugin-portal)
[![CI](https://github.com/PerryLink/dsh-plugin-portal/actions/workflows/ci.yml/badge.svg)](https://github.com/PerryLink/dsh-plugin-portal/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)

## Navegação por grupos

Os cartões são agrupados pelo campo `group` do roster (chave do grupo → rótulo em inglês):

| Grupo | Conteúdo |
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

As contagens por grupo são impressas pelo portão (`node scripts/verify-portal.mjs`) em vez de congeladas aqui.

## Status P0

Os P0 — o essencial do portal — estão **concluídos** na v1:

- **Portal estático v1** ✅ — `index.html` é um único arquivo com CSS/JS inline; zero dependências externas de runtime.
- **Sincronização da fonte de dados** ✅ — `data/repos.json` é uma cópia literal de `dsh-plugin-kit/data/repos.json` (mais uma nota de sincronização `_source`).
- **Render agrupado** ✅ — um cartão por entrada do roster, agrupados por `group`.
- **Badges de qualidade** ✅ — `img.shields.io/github/stars/…` ao vivo + um badge de avaliação estático por cartão; sem auto-hospedagem.

P1/P2 (já presentes nesta revisão): chips de nível de adoção somente leitura, o índice de atestações espelhado e a consulta em `verify.html`. Continuam fora de escopo: o pipeline de atualização automática de estrelas e avaliação, a busca e o filtro, as páginas de detalhe por plugin e um serviço de badges auto-hospedado.

## Sinais de qualidade

Cada cartão mostra dois sinais de qualidade: o **número de ★** do roster (instantâneo sincronizado) e um **badge de estrelas ao vivo** do GitHub via shields.io. O badge de avaliação estático reflete o valor `star` sincronizado (`n/a` para `dsh-plugin-kit`, que não publica número de estrelas). Esses sinais são apenas de exibição — o portal não pontua nada por conta própria; a pontuação vive em `dsh-plugin-kit`.

## Exibição somente leitura

O portal **só exibe** níveis de adoção e atestações: **não calcula um nível**, **não emite, valida nem revoga uma atestação** e **não é um site oficial, nem um órgão de certificação, nem uma auditoria de segurança**, nem representa o DeepSeek. Um eixo sem registro de evidência aparece como `not-run` / `not-measured`, nunca como aprovado; os cartões mantêm a ordem do roster e nunca são ordenados nem ponderados por nível.

- `data/levels.json` — uma projeção somente leitura das três profundidades de adoção (`entry` / `flow` / `boost`) para cada repo do roster. Um eixo sem registro de evidência aparece como `not-run` / `not-measured`, nunca como aprovado; os cartões mantêm a ordem do roster e nunca são ordenados nem ponderados por nível.
- `data/attestations.json` — um espelho do `publish/attestations/index.json` do repositório padrão. `source` aponta para o caminho ou URL upstream e `records` copia os arquivos de atestação referenciados por `file`, então a página de verificação não precisa de nenhuma chamada de rede. Os graus de atestação A–D são ortogonais aos níveis e nunca são convertidos.
- `verify.html` — consulta um `attestationId` e lê seu subject, grau, claimLevel, status, datas, escopo, lista de exclusões, isenção de responsabilidade e links de evidência. Um registro expirado aparece como `stale` e um retirado como `withdrawn`; nenhum deles aparece como válido. A página carrega a mesma advertência da visão principal: 非官方 · 非认证 · 非安全审计.

## Estrutura e sincronização

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

`data/repos.json` **não** é a fonte da verdade: [`dsh-plugin-kit/data/repos.json`](https://github.com/PerryLink/dsh-plugin-kit/blob/main/data/repos.json) é o dono do roster e das contagens de estrelas. Para atualizar este portal, copie aquele arquivo de novo sobre `data/repos.json`.

## Prévia local

Abra por HTTP (as páginas buscam `data/repos.json`, `data/levels.json` e `data/attestations.json`, que o `file://` bloqueia):

```sh
python -m http.server 8080
# then open http://localhost:8080/ and http://localhost:8080/verify.html
```

## Validação

Não precisa de navegador nem de etapa de instalação: o portão é sem dependências e afirma isso sobre si mesmo, então o portal continua executável a partir de um checkout limpo.

```sh
node scripts/verify-portal.mjs   # the gate itself
npm test                         # same gate, no install step (package.json has no dependencies)
```

Ele imprime as contagens autoritativas (entradas, grupos, por grupo) e verifica:

1. que o portão não importa nada além dos builtins de `node:`;
2. que `data/repos.json` satisfaz o contrato do roster — `name`/`group`/`role`/`star`, uma URL `https://github.com/<owner>/<repo>` cujo segmento de repo coincide com `name`, e nenhum nome duplicado;
3. que o script inline de `index.html` faz parse (`new vm.Script`) e roda sob um stub de DOM;
4. que cada entrada do roster tem um blurb em `DESCRIPTIONS` e cada grupo um rótulo `GROUP_EN` — uma entrada cujo blurb ainda não chegou precisa estar registrada em `PENDING_DESCRIPTION` (a allowlist deliberada), senão o portão falha;
5. que os badges de estrelas derivam seu owner do `repo.github`, incluindo owners de terceiros (`pan17/dsh-wechat`) — sem nenhum owner codificado à mão;
6. que `data/repos.json` é uma **cópia literal** do `dsh-plugin-kit/data/repos.json` upstream exceto por `_source`, e que o sha256 registrado em `_source` ainda coincide com aquele arquivo. Num runner sem o checkout irmão do kit (CI) essa verificação informa `skip` em vez de falhar, então o portão nunca fica vermelho por um motivo que o runner não possa consertar;
7. que o README não congela uma contagem;
8. que `data/levels.json` só referencia repos do roster, cobre todos eles, usa o enum de status por nível, e cada status `runtime` / `measured` / `manual` carrega um `evidence.url` `https` — `not-run` nunca é promovido a aprovado;
9. que `data/attestations.json` espelha o índice do repositório padrão com `attestationId`s únicos, datas `expiresAt` reais, detalhe para cada registro e **nenhum campo `level` em lugar nenhum** (um grau é ortogonal a um nível de adoção);
10. que `verify.html` faz parse, mostra 非官方 · 非认证 · 非安全审计 na mesma visão, e classifica um registro expirado ou retirado como `stale` / `withdrawn` — nunca `valid`;
11. que `index.html` renderiza a linha opcional de nível de `data/levels.json`, mostra `not-run` / `not-measured` em vez de um badge vazio e liga a evidência quando um registro tem uma.

Dois comportamentos que vale conhecer ao ler um cartão: o owner do badge de estrelas vem da própria URL `github` da entrada do roster, e uma entrada do roster sem blurb renderiza o marcador visível **`description not synced`** (acento, itálico) mais um `console.warn` em vez de mostrar silenciosamente texto de preenchimento.

## Família de plugins PerryLink DSH

Este projeto faz parte da família de plugins do DeepSeek Harness da [PerryLink](https://github.com/PerryLink). O índice completo grupo a grupo — padrões e verificações, guias, cadeia de ferramentas de desenvolvimento, plugins de runtime, a suíte de conformidade com 53 verificadores, operações de domínio, catálogos e a linha de decisão Phocinae, que é separada — está em [FAMILY.md](https://github.com/PerryLink/PerryLink/blob/main/FAMILY.md). O roster fica recolhido aqui embaixo para que todo README mantenha uma primeira tela curta; expanda-o para ver cada linha e seu estado.

<details>
<summary>Expandir todos os plugins</summary>

| Plugin | Estado |
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
| **[dsh-autotier](https://github.com/PerryLink/dsh-autotier)** | 🧊 CONGELADO — ver o README do repositório |
| **[dsh-budget](https://github.com/PerryLink/dsh-budget)** | 🧊 CONGELADO — ver o README do repositório |
| **[dsh-cert-mcp](https://github.com/PerryLink/dsh-cert-mcp)** | 🧊 CONGELADO — ver o README do repositório |
| **[dsh-claude-move](https://github.com/PerryLink/dsh-claude-move)** | 🧊 CONGELADO — ver o README do repositório |
| **[dsh-community-bench](https://github.com/PerryLink/dsh-community-bench)** | 🧊 CONGELADO — ver o README do repositório |
| **[dsh-defend](https://github.com/PerryLink/dsh-defend)** | 🧊 CONGELADO — ver o README do repositório |
| **[dsh-draw](https://github.com/PerryLink/dsh-draw)** | 🧊 CONGELADO — ver o README do repositório |
| **[dsh-reach](https://github.com/PerryLink/dsh-reach)** | 🧊 CONGELADO — ver o README do repositório |
| **[dsh-background-agents](https://github.com/PerryLink/dsh-background-agents)** | 🚫 RETIRADO — ver o README do repositório |
| **[dsh-session-pin](https://github.com/PerryLink/dsh-session-pin)** | 🚫 RETIRADO — ver o README do repositório |
| **[dsh-team-rooms](https://github.com/PerryLink/dsh-team-rooms)** | 🚫 RETIRADO — ver o README do repositório |

</details>

## Níveis de adoção (não oficiais)

O ecossistema caminha para três **profundidades de adoção**, não notas: **DSH-ENTRY** (limite de compatibilidade — dá para instalar e iniciar?), **DSH-FLOW** (usabilidade recomendada — um usuário consegue instalar, configurar, recuperar, atualizar e desinstalar?) e **DSH-BOOST** (prática Cordis — é mensuravelmente mais barato?). Não são certificação, nem ranking, nem têm endosso do DeepSeek.

- Cópia pública de ensino: [dsh-plugin-guide/guide/standards.md](https://github.com/PerryLink/dsh-plugin-guide/blob/main/guide/standards.md)
- `dsh-plugin-doctor` expõe uma projeção ENTRY em seu relatório JSON; `dsh-plugin-certification` explica por que seus graus A–D são ortogonais aos níveis.
- O `spec/levels.json` legível por máquina e a ferramenta de auditoria vivem no projeto privado `dsh-standards` (rascunho; pergunte ao mantenedor). Este portal não envia nem reimplementa essa spec: apenas renderiza os rótulos espelhados em `data/levels.json`, e `verify.html` lê o índice de atestações espelhado. O portal é somente leitura: não calcula o level nem certifica nada.
