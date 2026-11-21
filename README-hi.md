<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/assets/dsh-plugin-portal-hero-en-dark.webp">
  <img src="docs/assets/dsh-plugin-portal-hero-en-light.webp" width="100%" alt="dsh-plugin-portal: प्लगइन पारिस्थितिकी के लिए एक स्थिर पृष्ठ — data/repos.json से 18 समूहों में 99 roster कार्ड, index.html में इनलाइन CSS/JS और कोई build चरण नहीं, verify.html attestationId रिकॉर्ड केवल-पढ़न जाँचता है, और node scripts/verify-portal.mjs गिनतियाँ छापता है">
</picture>

# dsh-plugin-portal

[English](README.md) · [简体中文](README-zh.md) · [Español](README-es.md) · [Português](README-pt.md) · [हिन्दी](README-hi.md)

</div>

**PerryLink DSH प्लगइन पोर्टल** — बिना निर्भरता वाला स्थिर पोर्टल जो @perrylink DeepSeek Harness प्लगइन पारिस्थितिकी को समूहित कार्ड के रूप में रेंडर करता है: एक ही पृष्ठ, कोई build चरण नहीं, कोई runtime फ़्रेमवर्क नहीं।

> बिना निर्भरता वाला स्थिर पोर्टल: एक ही पृष्ठ, कोई build चरण नहीं, कोई runtime फ़्रेमवर्क नहीं, @perrylink DeepSeek Harness प्लगइन पारिस्थितिकी समूहित कार्ड के रूप में रेंडर होती है।

---

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/assets/dsh-plugin-portal-flow-v5-dark.svg">
  <img src="docs/assets/dsh-plugin-portal-flow-v5-light.svg" width="100%" alt="dsh-plugin-portal का संरचना चित्र: dsh-kit/data/repos.json को data/repos.json में ज्यों का त्यों कॉपी किया जाता है (_source में sha256); index.html 99 समूहित कार्ड रेंडर करता है जबकि verify.html ऑफ़लाइन data/levels.json और मिरर किया data/attestations.json पढ़ता है; node scripts/verify-portal.mjs बिना निर्भरता check 1–11 चलाकर गिनतियाँ छापता है">
</picture>

*संरचना: data/repos.json → index.html / verify.html → गेट। चित्र के लेबल असली पथ, फ़ाइल नाम और गेट कमांड हैं, इसलिए एक ही चित्र पाँचों भाषाओं के लिए है।*

## पारिस्थितिकी अवलोकन

![dsh-plugin-portal: साफ़ checkout पर node scripts/verify-portal.mjs का असली टर्मिनल रन — check 1, 2, 4, 9 पास, sibling dsh-plugin-kit न होने पर check 6 skip, गिनती 99 प्रविष्टियाँ 18 समूहों में, और अंत verify-portal: PASS](docs/assets/dsh-plugin-portal-demo.gif)

*एनिमेशन: 2026-11-21 को साफ़ checkout से node scripts/verify-portal.mjs का दोबारा रन — sibling dsh-plugin-kit न होने से check 6 skip होता है, ठीक CI runner की तरह। असली stdout, कोई नेटवर्क कॉल नहीं।*

पोर्टल [`dsh-plugin-kit/data/repos.json`](https://github.com/PerryLink/dsh-plugin-kit/blob/main/data/repos.json) द्वारा ट्रैक की गई पूरी रजिस्ट्री रेंडर करता है: हर roster प्रविष्टि, प्लगइन के साथ `dsh-plugin-kit` इंफ्रा रिपॉज़िटरी। हर कार्ड में repo का **नाम**, **एक-पंक्ति विवरण**, **★ संख्या**, दो **shields.io बैज** (GitHub की लाइव स्टार्स + एक स्थिर रेटिंग बैज) और **GitHub लिंक** दिखता है। प्रामाणिक गिनतियाँ `node scripts/verify-portal.mjs` छापता है (README जान-बूझकर कोई स्थिर संख्या नहीं रखता)।
[![dshfind](https://dshfind.com/api/badge/PerryLink/dsh-plugin-portal?metric=downloads)](https://dshfind.com/plugins/PerryLink/dsh-plugin-portal?ref=badge)
[![npm](https://img.shields.io/npm/v/dsh-plugin-portal)](https://www.npmjs.com/package/dsh-plugin-portal)
[![CI](https://github.com/PerryLink/dsh-plugin-portal/actions/workflows/ci.yml/badge.svg)](https://github.com/PerryLink/dsh-plugin-portal/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)

## समूह नेविगेशन

कार्ड roster के `group` फ़ील्ड से समूहित होते हैं (समूह कुंजी → अंग्रेज़ी लेबल):

| समूह | सामग्री |
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

प्रति-समूह गिनतियाँ यहाँ स्थिर करने के बजाय गेट (`node scripts/verify-portal.mjs`) छापता है।

## P0 स्थिति

P0 — पोर्टल की बुनियादी अनिवार्यताएँ — v1 के लिए **पूरी** हैं:

- **स्थिर पोर्टल v1** ✅ — `index.html` इनलाइन CSS/JS के साथ एक ही फ़ाइल है; शून्य बाहरी runtime निर्भरताएँ।
- **डेटा स्रोत सिंक** ✅ — `data/repos.json` `dsh-plugin-kit/data/repos.json` की ज्यों की त्यों प्रतिलिपि है (साथ में `_source` सिंक टिप्पणी)।
- **समूहित रेंडर** ✅ — हर roster प्रविष्टि के लिए एक कार्ड, `group` से समूहित।
- **गुणवत्ता बैज** ✅ — लाइव `img.shields.io/github/stars/…` + प्रति कार्ड एक स्थिर रेटिंग बैज; कोई self-hosting नहीं।

P1/P2 (इस संस्करण में आ चुके): केवल-पढ़न adoption-level chips, मिरर किया attestation सूचकांक और `verify.html` जाँच। अभी भी दायरे से बाहर: स्टार/रेटिंग स्वतः-रिफ़्रेश pipeline, खोज/फ़िल्टर, प्रति-प्लगइन विवरण पृष्ठ और स्वयं-होस्टेड बैज सेवा।

## गुणवत्ता संकेत

हर कार्ड दो गुणवत्ता संकेत दिखाता है: roster से **★ संख्या** (सिंक किया स्नैपशॉट) और shields.io के ज़रिए GitHub से **लाइव स्टार्स बैज**। स्थिर रेटिंग बैज सिंक किए गए `star` मान को दर्शाता है (`dsh-plugin-kit` के लिए `n/a`, जो स्टार संख्या नहीं देता)। ये संकेत केवल प्रदर्शन के लिए हैं — पोर्टल अपनी ओर से कोई स्कोरिंग नहीं करता; स्कोरिंग `dsh-plugin-kit` में है।

## केवल-पढ़न प्रदर्शन

पोर्टल **केवल** adoption levels और attestations **प्रदर्शित** करता है: **level की गणना नहीं करता**, **attestation जारी, सत्यापित या रद्द नहीं करता**, और **न आधिकारिक साइट है, न प्रमाणन निकाय, न सुरक्षा ऑडिट**, और न DeepSeek का प्रतिनिधि है। बिना साक्ष्य रिकॉर्ड वाला अक्ष `not-run` / `not-measured` दिखता है, कभी पास के रूप में नहीं; कार्ड roster का क्रम रखते हैं और level से कभी क्रमबद्ध या भारित नहीं होते।

- `data/levels.json` — हर roster repo के लिए तीन adoption गहराइयों (`entry` / `flow` / `boost`) का केवल-पढ़न प्रक्षेपण। बिना साक्ष्य रिकॉर्ड वाला अक्ष `not-run` / `not-measured` दिखता है, कभी पास के रूप में नहीं; कार्ड roster का क्रम रखते हैं और level से कभी क्रमबद्ध या भारित नहीं होते।
- `data/attestations.json` — मानक रिपॉज़िटरी के `publish/attestations/index.json` का मिरर। `source` upstream पथ या URL की ओर इशारा करता है और `records` उन attestation फ़ाइलों की प्रतिलिपि रखता है जिनका `file` में संदर्भ है, इसलिए verify पृष्ठ को कोई नेटवर्क कॉल नहीं चाहिए। A–D attestation ग्रेड levels के लिए ऑर्थोगोनल हैं और कभी परिवर्तित नहीं होते।
- `verify.html` — `attestationId` खोजकर उसका subject, ग्रेड, claimLevel, स्थिति, तिथियाँ, दायरा, बहिष्कृत सूची, अस्वीकरण और साक्ष्य लिंक पढ़ता है। समाप्त रिकॉर्ड `stale` और वापस लिया गया `withdrawn` दिखता है; कोई भी कभी वैध के रूप में नहीं दिखता। पृष्ठ वही same-view अस्वीकरण 非官方 · 非认证 · 非安全审计 दिखाता है।

## संरचना और सिंक

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

`data/repos.json` **सत्य का स्रोत नहीं** है: [`dsh-plugin-kit/data/repos.json`](https://github.com/PerryLink/dsh-plugin-kit/blob/main/data/repos.json) roster और स्टार गिनतियों का स्वामी है। इस पोर्टल को रिफ़्रेश करने के लिए उसी फ़ाइल को फिर से `data/repos.json` पर कॉपी करें।

## स्थानीय पूर्वावलोकन

HTTP से खोलें (पृष्ठ `data/repos.json`, `data/levels.json` और `data/attestations.json` fetch करते हैं, जिन्हें `file://` रोकता है):

```sh
python -m http.server 8080
# then open http://localhost:8080/ and http://localhost:8080/verify.html
```

## सत्यापन

न ब्राउज़र चाहिए, न इंस्टॉल चरण: गेट बिना निर्भरता वाला है और अपने बारे में यही दावा करता है, इसलिए पोर्टल साफ़ checkout से भी चलता रहता है।

```sh
node scripts/verify-portal.mjs   # the gate itself
npm test                         # same gate, no install step (package.json has no dependencies)
```

यह प्रामाणिक गिनतियाँ (प्रविष्टियाँ, समूह, प्रति-समूह) छापता है और जाँचता है:

1. कि गेट `node:` builtins के अलावा कुछ import नहीं करता;
2. कि `data/repos.json` roster अनुबंध पूरा करता है — `name`/`group`/`role`/`star`, एक `https://github.com/<owner>/<repo>` URL जिसका repo खंड `name` से मेल खाता है, और कोई डुप्लिकेट नाम नहीं;
3. कि `index.html` का इनलाइन स्क्रिप्ट parse होता है (`new vm.Script`) और DOM stub के नीचे चलता है;
4. कि हर roster प्रविष्टि का `DESCRIPTIONS` में blurb है और हर समूह का `GROUP_EN` लेबल — जिस प्रविष्टि का blurb अभी नहीं आया वह `PENDING_DESCRIPTION` (जान-बूझकर allowlist) में दर्ज होनी चाहिए, वरना गेट फ़ेल होता है;
5. कि स्टार्स बैज अपना owner `repo.github` से लेते हैं, तीसरे-पक्ष के owners सहित (`pan17/dsh-wechat`) — कोई hardcoded owner नहीं;
6. कि `data/repos.json` upstream `dsh-plugin-kit/data/repos.json` की **ज्यों की त्यों प्रतिलिपि** है सिवाय `_source` के, और `_source` में दर्ज sha256 अभी भी उस फ़ाइल से मेल खाता है। sibling kit checkout के बिना चलने वाले runner (CI) पर यह जाँच फ़ेल होने के बजाय `skip` बताती है, इसलिए गेट कभी उस कारण लाल नहीं होता जिसे runner ठीक नहीं कर सकता;
7. कि README कोई गिनती स्थिर नहीं करता;
8. कि `data/levels.json` केवल roster repos का संदर्भ देता है, उन सबको कवर करता है, प्रति-स्तर status enum का उपयोग करता है, और हर `runtime` / `measured` / `manual` status के साथ एक `https` `evidence.url` है — `not-run` को कभी पास तक उन्नत नहीं किया जाता;
9. कि `data/attestations.json` मानक-रिपॉज़िटरी सूचकांक को अनूठे `attestationId`s, असली `expiresAt` तिथियों, हर रिकॉर्ड के लिए विवरण और **कहीं भी कोई `level` फ़ील्ड नहीं** के साथ मिरर करता है (ग्रेड adoption level के लिए ऑर्थोगोनल है);
10. कि `verify.html` parse होता है, उसी दृश्य में 非官方 · 非认证 · 非安全审计 दिखाता है, और समाप्त या वापस लिए गए रिकॉर्ड को `stale` / `withdrawn` वर्गीकृत करता है — कभी `valid` नहीं;
11. कि `index.html` `data/levels.json` से वैकल्पिक level पंक्ति रेंडर करता है, खाली बैज की जगह `not-run` / `not-measured` दिखाता है, और जब किसी रिकॉर्ड के पास साक्ष्य हो तो उसे लिंक करता है।

कार्ड पढ़ते समय दो व्यवहार जानने लायक हैं: स्टार्स बैज का owner roster प्रविष्टि के अपने `github` URL से आता है, और बिना blurb वाली roster प्रविष्टि चुपचाप placeholder कॉपी दिखाने के बजाय दृश्यमान **`description not synced`** मार्कर (accent, italic) और एक `console.warn` दिखाती है।

## PerryLink DSH प्लगइन परिवार

यह परियोजना [PerryLink](https://github.com/PerryLink) के DeepSeek Harness प्लगइन परिवार का हिस्सा है। समूह-दर-समूह पूरा इंडेक्स — मानक और जाँचें, गाइड, डेवलपर टूलचेन, runtime प्लगइन, 53-चेकर compliance सूट, डोमेन ऑपरेशंस, कैटलॉग और अलग Phocinae निर्णय लाइन — [FAMILY.md](https://github.com/PerryLink/PerryLink/blob/main/FAMILY.md) में है। roster नीचे सिकुड़ा रहता है ताकि हर README की पहली स्क्रीन छोटी रहे; हर पंक्ति और उसकी स्थिति देखने के लिए इसे खोलें।

<details>
<summary>सभी प्लगइन खोलें</summary>

| प्लगइन | स्थिति |
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
| **[dsh-autotier](https://github.com/PerryLink/dsh-autotier)** | 🧊 फ़्रोज़न — रिपॉज़िटरी README देखें |
| **[dsh-budget](https://github.com/PerryLink/dsh-budget)** | 🧊 फ़्रोज़न — रिपॉज़िटरी README देखें |
| **[dsh-cert-mcp](https://github.com/PerryLink/dsh-cert-mcp)** | 🧊 फ़्रोज़न — रिपॉज़िटरी README देखें |
| **[dsh-claude-move](https://github.com/PerryLink/dsh-claude-move)** | 🧊 फ़्रोज़न — रिपॉज़िटरी README देखें |
| **[dsh-community-bench](https://github.com/PerryLink/dsh-community-bench)** | 🧊 फ़्रोज़न — रिपॉज़िटरी README देखें |
| **[dsh-defend](https://github.com/PerryLink/dsh-defend)** | 🧊 फ़्रोज़न — रिपॉज़िटरी README देखें |
| **[dsh-draw](https://github.com/PerryLink/dsh-draw)** | 🧊 फ़्रोज़न — रिपॉज़िटरी README देखें |
| **[dsh-reach](https://github.com/PerryLink/dsh-reach)** | 🧊 फ़्रोज़न — रिपॉज़िटरी README देखें |
| **[dsh-background-agents](https://github.com/PerryLink/dsh-background-agents)** | 🚫 सेवानिवृत्त — रिपॉज़िटरी README देखें |
| **[dsh-session-pin](https://github.com/PerryLink/dsh-session-pin)** | 🚫 सेवानिवृत्त — रिपॉज़िटरी README देखें |
| **[dsh-team-rooms](https://github.com/PerryLink/dsh-team-rooms)** | 🚫 सेवानिवृत्त — रिपॉज़िटरी README देखें |

</details>

## अपनाने के स्तर (गैर-आधिकारिक)

पारिस्थितिकी तीन **adoption गहराइयों** की ओर बढ़ रही है, ग्रेड की नहीं: **DSH-ENTRY** (संगतता आधार — क्या इंस्टॉल और बूट हो सकता है?), **DSH-FLOW** (अनुशंसित उपयोगिता — क्या उपयोगकर्ता इसे इंस्टॉल, कॉन्फ़िगर, रिकवर, अपग्रेड और अनइंस्टॉल कर सकता है?) और **DSH-BOOST** (Cordis अभ्यास — क्या यह मापने योग्य रूप से सस्ता है?)। ये न प्रमाणन हैं, न रैंकिंग, और न DeepSeek का समर्थन।

- सार्वजनिक शिक्षण प्रति: [dsh-plugin-guide/guide/standards.md](https://github.com/PerryLink/dsh-plugin-guide/blob/main/guide/standards.md)
- `dsh-plugin-doctor` अपनी JSON रिपोर्ट में ENTRY प्रक्षेपण दिखाता है; `dsh-plugin-certification` समझाता है कि उसके A–D ग्रेड levels के लिए ऑर्थोगोनल क्यों हैं।
- मशीन-पठनीय `spec/levels.json` और ऑडिट टूल निजी `dsh-standards` परियोजना में रहते हैं (ड्राफ़्ट; मेंटेनर से पूछें)। यह पोर्टल वह spec न भेजता है न दोबारा लागू करता है: यह केवल `data/levels.json` में मिरर किए लेबल रेंडर करता है, और `verify.html` मिरर किया attestation सूचकांक पढ़ता है। पोर्टल केवल-पढ़न है: न level की गणना करता है, न प्रमाणन।
