# netoviz Node24 / Nuxt4 世代移行 — 実装計画

> **本文書は作業記録(アーカイブ)です。** Node.js 24 / Nuxt4 世代への移行作業(2026年実施)の計画立案から実装完了までの記録で、
> `feature/node24-nuxt4-migration` ブランチとして作業し、`v0.9.0-dev` にマージ済み(全Phase完了)。
> 移行後の技術スタック・設計上の注意点は [CLAUDE.md](../CLAUDE.md) と [docs/architecture.md](./architecture.md) を参照。
> 以下は移行作業当時の調査・意思決定プロセスをそのまま残したもので、内容は当時の時点のもの。

## Context

netoviz は Node.js 22 + Nuxt2(Vue2.7)+ Vuetify2 + Vuex3 + Babel/ESLint8 という、いずれもEOL済み・保守モードの世代構成で稼働している。Node.js 24 LTSと現行サポートフレームワーク世代へ更新するため、依存関係調査(Part A)・更新先候補整理(Part B)・メジャーバージョン変更の詳細調査(Part C)・移行戦略比較(Part D)を実施した。

**方針(確定)**:
- Nuxt本体は **Nuxt4系** へ移行する
- サーバーは **Express Router形式の既存コードを維持**、ホストは Nitro に委譲する(`server/plugins/` + h3の`fromNodeMiddleware`)
- 移行戦略は **C. ハイブリッド**(独立変更は段階的に、Nuxt/Vue/Vuetify等の不可分なコアグループは一括で移行)を採用

このリポジトリにはテストコードが存在しないため(CLAUDE.md記載の方針通り)、各Phase完了時点で実際に`npm run dev`相当のコマンドでアプリを起動し、5種のビジュアライザー(forceSimulation/dependency/dependency2/nested/distance)とREST API 3エンドポイントを手動確認することを検証手段とする。

## 実装Phase(このまま実施する)

### Phase 0 — 独立変更の先行実施(低リスク)
- `@nuxtjs/axios` を `package.json`・`nuxt.config.js` から削除(使用箇所0件、確認済み)
- Node.js 24 対応: `Dockerfile`(`FROM node:22.23-alpine` → `node:24-alpine`系)、`package.json` `engines.node`更新
- d3-*系・consola・dotenv・debounce・cross-env等の周辺パッケージのバージョン確認・更新
- 検証: `docker-build`→コンテナ起動→既存Nuxt2構成のまま全ビジュアライザーが動作することを確認(Nuxt本体はまだ変更しないため、Node24化のみの影響を切り分けられる)

### Phase 1 — コアグループの一体移行(Nuxt4 + Vue3 + Vuetify3 + vue-router4 + Pinia)
フィーチャーブランチで作業。詳細はPart C-1〜C-3、C-5(store関連)参照。

**Critical files**:
- `nuxt.config.js`(ESM化、`runtimeConfig`、`vuetify-nuxt-module`)
- `store/index.js`, `store/alert.js` → Pinia `defineStore`
- `components/VisualizeDiagramCommon.vue`(mixin、`beforeDestroy`→`beforeUnmount`、`$vuetify.breakpoint`→`$vuetify.display`)— 全5ビジュアライザー共通なので最初に対応
- `components/TableDiagrams.vue`(v-data-table、Part B確定内容)
- `components/TableVisualizers.vue`(`v-list-item-group`廃止対応)
- `layouts/default.vue`(`$nuxt.$route`→`$route`、`<nuxt/>`→`<NuxtPage/>`、非同期コンポーネント記法)
- `pages/index.vue`, `pages/about.vue`, `pages/model/_network/_snapshot/_modelFile.vue`(`[network]/[snapshot]/[modelFile].vue`へリネーム、`head()`→`useHead()`)
- `mapState`/`mapMutations`使用6ファイル、`$store.watch`使用2ファイル → Pinia対応

**進め方**: 共通基盤(mixin、store)を先に直し、5種のビジュアライザーを forceSimulation → dependency → dependency2 → nested → distance の順に1つずつ手動確認。

### Phase 2 — サーバー/Lint移行(Phase1完了後)

> **実施済みの計画変更**: Phase1実施中、Nuxt4インストール直後に旧`server/index.js`(Nuxt2の`Builder`/`nuxt.render`をExpressにマウントする方式)が即座に動作不能になることが判明した(Nitroアーキテクチャに`Builder`/`nuxt.render`が存在しないため)。Phase1の動作確認(`npm run dev`)自体が成立しないため、サーバー統合(`server/index.js`削除・`server/plugins/express-api.js`新規作成・起動スクリプト変更)は**Phase1に前倒しして実施済み**。Phase2はBabel/ESLintの整理に純化された。

- ~~`server/index.js` 削除、`server/plugins/express-api.js` 新規作成~~ → **Phase1で完了**(h3 v2の`router.use()`はExpressのようなprefixマウントではなく厳密一致のため、実装は`nitroApp.router.use('/api/**', fromNodeMiddleware(app))`+内部にThinなExpress appを挟む形に調整。Part C-5の想定から実装詳細が変わった)
- `babel.config.js` の完全削除、Babel関連devDependencies一式削除(Phase1では`@nuxt/babel-preset-app`依存部分のみ削除する応急処置に留めた。`@babel/preset-env`と`@babel/eslint-parser`はまだ残存)
- `package.json` scripts(`dev`/`start`)→ **Phase1で`nuxt dev`/`node .output/server/index.mjs`に変更済み**
- `.eslintrc.js` → `eslint.config.js`(flat config、`@nuxt/eslint`)。Phase1では応急処置として`globals`にNuxt4自動importグローバルを追加したのみ(`defineNuxtConfig`/`defineNitroPlugin`/`useHead`/`useRoute`)。本移行はPhase2で実施

**Phase2実施結果**: `babel.config.js`完全削除・Babel関連devDependencies一式削除。ESLint 8→10(`@nuxtjs/eslint-config`/`@nuxtjs/eslint-module`→`@nuxt/eslint`、`.eslintrc.js`→`eslint.config.mjs`のflat config)。Prettier 2→3(`prettier-config-standard`もPrettier3対応版7.0.0に更新)。`@nuxt/eslint`の既定ルールが厳格なため`no-unused-vars`/`no-unused-expressions`系を旧設定相当に緩和し、無関係な既存コードへの修正を回避。`npm run lint`は新規エラーなし(既存1件のみ残存)、サンプルデータでの動作確認も完了。

### Phase 3 — 仕上げ(実施済み)
- Prettier 2→3(Phase2で実施済み)
- `Dockerfile`のCMDをJSON配列形式に修正、`node:24-alpine`でDocker build/run実機確認(esbuild/sass-embedded等のネイティブモジュールも問題なし)
- GitHub Actions各actionを最新安定版に更新(checkout v3→v7、setup-buildx-action v2→v4、login-action v2→v4、build-push-action v4→v7、delete-package-versions v4→v5)
- `package.json`に`postinstall: "nuxt prepare"`追加(`eslint.config.mjs`が`.nuxt/`生成物に依存するため)
- `CLAUDE.md`の技術スタック記述・サーバー統合の注意点を更新

**全Phase完了**(`feature/node24-nuxt4-migration`ブランチ、コミット: 8847598, 3c91349, 11b7a98, d33c20d)。マージ前にブラウザでのD3描画目視確認を推奨(本環境にヘッドレスブラウザが無く、HTTPレベルの検証のみ実施)。

## 検証方法(共通)

各Phase完了時に以下を実施:
1. `npm run dev`(またはPhase2以降は`nuxt dev`)でアプリを起動
2. 5種のビジュアライザーをブラウザで開き、トポロジ図が描画されることを確認(D3のSVG描画、ノードクリック、レイヤー選択、リサイズ)
3. REST API 3エンドポイント(`GET /api/models`, `GET/POST /api/graph/...`)の応答を確認
4. `npm run lint`が通ることを確認

---

## Part A. 現状調査(依存関係・技術スタック)

### A-1. Node.js / npm バージョン

- `package.json` の `engines.node`: `>=22.x`(npmの`engines`指定なし)
- `.nvmrc` / `.node-version` は存在しない。実質的なバージョンピンは `Dockerfile` の `FROM node:22.23-alpine` のみ
- `package.json` に `main` / `type` フィールドの指定なし(ESM/CJS明示なし)。`import`/`export`構文を`babel-node`でCJSに変換して実行している

### A-2. package.json 依存関係

**dependencies**: @babel/node ^7.29.7, @babel/plugin-proposal-private-property-in-object ^7.21.11, @nuxtjs/axios ^5.13.6, @nuxtjs/dotenv ^1.4.2, consola ^2.15.3, cross-env ^7.0.3, d3-drag/d3-fetch/d3-force/d3-selection/d3-shape/d3-timer/d3-zoom(各^3系), debounce ^1.2.1, dotenv ^16.6.1, express ^4.22.2, localStorage ^1.0.4, nuxt ^2.18.1, nuxt-env ^0.1.0

**devDependencies**: @babel/core/@babel/eslint-parser/@babel/plugin-syntax-dynamic-import/@babel/preset-env(各^7系), @nuxtjs/eslint-config ^11.0.0, @nuxtjs/eslint-module ^3.1.0, @nuxtjs/vuetify ^1.12.3, eslint ^8.57.1, eslint-config-prettier ^8.10.2, eslint-plugin-prettier ^4.2.5, foodoc 0.0.9, jsdoc ^3.6.11, nodemon ^3.1.14, prettier ^2.8.8, prettier-config-standard ^5.0.0

**推移的依存の実体**: vue 2.7.16 / vuex 3.6.2 / vue-router 3.6.5 / vuetify 2.7.2

テストランナー未導入、TypeScript未使用。

### A-3. 主要構成

- `server/index.js`(babel-node起動、Express + Nuxt2 `Builder`/`nuxt.render`のカスタム統合)。CLAUDE.md制約:「`.mjs`化するとNode22で`@babel/register`相当のフックが効かず起動失敗」
- `server/api/rest/`(Express Router、3エンドポイント: GET `/api/models`、POST/GET `/api/graph/:graphName/:network/:snapshot/:jsonName`)
- `lib/diagram/`(フロント)が`server/graph/common/base.js`等を直接import(意図的密結合、CLAUDE.md記載)
- Vue2固有API使用: `v-slot:header/item`(Vuetify2 v-data-table)、`beforeDestroy`、`v-resize`、`mixins:`(7箇所)、非同期コンポーネント定義、`head()`、レガシー動的ルート`_network/_snapshot/_modelFile.vue`、`this.$nuxt.$route`
- Vuex: `store/index.js`/`store/alert.js`とも state+mutationsのみ(getters/actions未使用)
- D3はVueの`$refs`を使わずグローバルDOM ID(`div#visualizer`等)を直接操作
- Dockerfile: `node:22.23-alpine`、`CMD npm run dev`(意図的devモード)。GitHub Actionsはイメージbuild/pushのみ、lint/testステップなし

---

## Part B. 更新先候補の整理

### B-1. コア・フレームワーク群(Nuxt / Vue / Vuetify / ルーティング / ストア)

**世代間の依存関係が最も重要な箇所。以下は「一体として同時に上げる必要がある」グループ。**

Nuxtのメジャーバージョンが対応Vueメジャーを決め、Vueメジャーが対応Vuetify/vue-router/状態管理ライブラリの選択肢を決める、という縦の依存チェーンがある。Nuxt2のみ上げてVueを2.7のままにする、といった部分的更新はできない(Nuxt3/4はVue3必須)。

| パッケージ | 現在バージョン | 更新候補 | 現行サポート安定版 | メジャーを跨ぐか | Breaking changesの規模 | 他パッケージとの依存関係 | 単純更新 or コード移行 |
|---|---|---|---|---|---|---|---|
| nuxt | 2.18.1 | **Nuxt 3系 or 4系**(現行安定版はNuxt 4系。3系もまだメンテナンスされているが新規プロジェクトの現行推奨は4系) | Nuxt 4.x(3.xも継続サポート中) | ○(2→3/4、2メジャー跨ぐ) | **極大**。ビルドエンジンがwebpack+babel→Vite/Rollup(Nitroサーバー)に変わる、ディレクトリ規約変更(Nuxt4は`app/`配下必須)、`asyncData`/`fetch`廃止→Composition API、モジュールAPI全面変更 | Vue3必須、@nuxtjs/vuetify→vuetify-nuxt-module必須、@nuxtjs/axios廃止対象、@nuxtjs/eslint-config→@nuxt/eslint必須、babel.config.js事実上不要に | **コード移行必須**(最大の移行作業) |
| vue | 2.7.16 | **Vue 3.5系(最新3.x)** | 3.5.x以降(3.xが現行、Vue2は2023年末でEOL済み・以後は延長サポートのみ) | ○(2→3) | **極大**。Options APIは維続サポートされるがリアクティビティ実装がProxyベースに変更、グローバルAPI変更(`new Vue()`→`createApp()`)、一部ライフサイクル名変更(`beforeDestroy`→`beforeUnmount`等)、`filters`/`$listeners`廃止(※本リポジトリでは元々未使用) | Nuxt本体のメジャーに完全従属(Nuxt4を選べば自動的にVue3系)。vuetify3・pinia・vue-router4はVue3専用 | **コード移行必須**(ただし調査済みの通り本リポジトリのVue2固有API使用は限定的で影響範囲は絞れる) |
| vuetify(+@nuxtjs/vuetify) | vuetify 2.7.2 / @nuxtjs/vuetify 1.12.3 | **vuetify 3.x系** + Nuxtモジュールは`vuetify-nuxt-module`(`@nuxtjs/vuetify`はVue2/Nuxt2専用でメンテ終了) | vuetify 3.7系以降(現行) | ○(2→3) | **大**。Vue3専用への全面リライト、コンポーネントAPI・テーマ設定・アイコン設定が変更、`v-data-table`のスロットAPI変更(`v-slot:item`→`#item.xxx`形式など) | Vue3必須。`@nuxtjs/vuetify`はNuxt3/4非対応のため丸ごと`vuetify-nuxt-module`に置換必須 | **コード移行必須**(`TableDiagrams.vue`のv-data-table部分、`v-resize`ディレクティブの動作確認含む) |
| vue-router | 3.6.5(推移的依存) | **vue-router 4.x** | 4.x系(現行、Nuxt4に内蔵) | ○(3→4) | **中**。History APIの初期化方法変更、`this.$nuxt.$route`→`useRoute()`、動的ルートのファイル名規約(`_param`→`[param]`) | Nuxtのメジャーに完全従属(Nuxt4選択で自動的にvue-router4) | Nuxt本体移行に包含される形。個別の追加作業は`_network/_snapshot/_modelFile.vue`のリネームのみ |
| vuex → **Pinia** | vuex 3.6.2 | **Pinia 3.x**(Vue3専用、公式後継) | Pinia 3.x(現行、Vuexは公式に非推奨・保守モード) | パッケージ自体を乗り換え(vuex→pinia、厳密な意味でのメジャーアップではなく置換) | **中〜大**(移行元がシンプルな構成なので実作業は小さい)。`mapState`/`mapMutations`呼び出し6箇所、`this.$store.watch()`2箇所の書き換えが必要 | Vue3化と同時に行うのが合理的(vuex4はVue3対応するが公式にPiniaへの移行が推奨されている) | **コード移行必要**(調査済みの通りstate+mutationsのみのシンプル構成のため難易度は低い) |

### B-2. ビルド・Lint・フォーマッタ

| パッケージ | 現在バージョン | 更新候補 | 現行サポート安定版 | メジャーを跨ぐか | Breaking changesの規模 | 他パッケージとの依存関係 | 単純更新 or コード移行 |
|---|---|---|---|---|---|---|---|
| eslint | 8.57.1 | **9.x** | 9.x(現行、8.xはEOL) | ○(8→9) | **大**。設定ファイル形式が`.eslintrc.js`→flat config(`eslint.config.js`)に変更、`@nuxtjs/eslint-config`/`@nuxtjs/eslint-module`はNuxt2/ESLint8世代専用で非対応 | Nuxt4系では`@nuxt/eslint`モジュールがflat configを前提に提供される。Nuxt移行と同時実施が自然 | **設定移行必要**(ルール自体の大移動、コード側の修正は少ない) |
| @nuxtjs/eslint-config / @nuxtjs/eslint-module | 11.0.0 / 3.1.0 | **廃止 → `@nuxt/eslint`(公式モジュール)に置換** | @nuxt/eslint 現行版 | パッケージ自体を乗り換え | **大**(設定の書き方が根本的に変わる) | Nuxt4 + ESLint9前提 | 設定移行必要 |
| @babel/eslint-parser | 7.29.7 | **不要化**(`espree`標準パーサ、またはVue用は`vue-eslint-parser`のみで十分) | - | - | 小(削除のみ) | Babel全体撤去と連動 | 単純削除 |
| prettier | 2.8.8 | **3.x** | 3.x(現行) | ○(2→3) | **小〜中**。デフォルトのフォーマットルールが一部変化(末尾カンマ等)。`prettier-config-standard`が3.x対応か要確認(非対応なら`@vue/prettier-config`等に置換検討) | eslint-config-prettier/eslint-plugin-prettierは9.x系ESLintのflat config対応版が必要 | 設定更新+再フォーマット実行が必要(コードロジック変更は無し) |
| eslint-config-prettier / eslint-plugin-prettier | 8.10.2 / 4.2.5 | 各ESLint9対応版の最新 | 現行版 | ○(メジャー跨ぐ可能性あり) | 小 | ESLint9 flat config前提 | 単純更新+設定書き換え |
| babel一式(@babel/core, @babel/preset-env, @babel/plugin-*, babel.config.js) | 各7.x | **原則撤去** | - | - | **大**(仕組みごと削除) | Nuxt4のビルドはVite(esbuild/Rollup)ベースになりBabel設定は基本不要。`@nuxt/babel-preset-app`もNuxt2専用 | ファイル削除+ビルド設定の作り直し |
| @babel/node(babel-node起動方式) | 7.29.7 | **撤去 → `nuxt dev`/`nuxt build && node .output/server/index.mjs`等、Nitro標準の起動コマンドに置換** | - | - | **大**。`server/index.js`のカスタムExpress統合自体を廃止するか、Nitroのserver middlewareとして再構成するかの設計判断が必要 | Express撤去/再構成と一体 | コード移行必須(サーバー起動方式の再設計) |

### B-3. サーバー / ランタイム

| パッケージ | 現在バージョン | 更新候補 | 現行サポート安定版 | メジャーを跨ぐか | Breaking changesの規模 | 他パッケージとの依存関係 | 単純更新 or コード移行 |
|---|---|---|---|---|---|---|---|
| express | 4.22.2 | **維持する場合は4.x最新、あるいはExpress 5.x**。ただしNuxt4のNitro採用時はExpressそのものを撤去し、Nitroのserver routes(`server/api/*.ts`)に統合するのが現行推奨構成 | Express 5.x(現行安定)、または撤去 | ○(4→5、採用する場合)。撤去する場合はメジア判断不要 | Express5自体は中規模(ミドルウェアの一部非対応化、Promise対応強化)。Nitro統合を選ぶ場合はアーキテクチャ変更として「大」 | Nuxt本体の起動方式(Nitro)と密接に関連。`server/api/rest/`3エンドポイントの移植先設計に直結 | **設計判断が必要**(単純更新では済まない可能性が高い) |
| consola | 2.15.3 | **3.x** | 3.x(現行) | ○(2→3) | **小〜中**。ロガーAPIの一部(`consola.info`等)は互換だが、インスタンス生成方法・レベル指定方法が変更 | 単独ライブラリ、依存関係の連鎖は無し | ほぼ単純更新(呼び出し箇所の確認程度) |
| dotenv | 16.6.1 | **最新16.x系 or 17.x**(安定版を確認の上採用) | 現行最新 | 場合により○ | 小(APIは基本後方互換) | Nuxt4は`.env`読込を標準サポートするため`@nuxtjs/dotenv`自体が不要になる可能性あり | 単純更新、`@nuxtjs/dotenv`は撤去候補 |
| @nuxtjs/dotenv | 1.4.2 | **撤去**(Nuxt3/4は標準で`.env`をサポート) | - | - | 小(削除のみ) | Nuxt本体機能に統合 | 単純削除 |
| nuxt-env | 0.1.0 | **撤去 → `runtimeConfig`(Nuxt3/4標準機能)に置換** | - | - | 中(利用箇所`this.$env.NETOVIZ_REST_PORT`の書き換えが必要) | Nuxt本体の設定方式変更と連動 | コード移行必要(使用箇所は限定的) |
| @nuxtjs/axios | 5.13.6 | **撤去**(実コード使用0件確認済み。Nuxt3/4では`$fetch`/`ofetch`が標準) | - | - | 無し(削除のみ) | - | 単純削除 |
| cross-env | 7.0.3 | 維持可(現行安定) | 現行 | なし | 無し | - | 単純更新のみ |
| nodemon | 3.1.14 | 維持可、または撤去(Nuxt/Nitroのdevサーバーが自前でHMR/再起動を提供するため`server/index.js`独自運用時のみ必要) | 現行 | なし | 無し〜小 | babel-node撤去と連動して不要になる可能性 | 構成次第で単純削除 |

### B-4. フロントエンド・ユーティリティ(D3・その他)

| パッケージ | 現在バージョン | 更新候補 | 現行サポート安定版 | メジャーを跨ぐか | Breaking changesの規模 | 他パッケージとの依存関係 | 単純更新 or コード移行 |
|---|---|---|---|---|---|---|---|
| d3-drag / d3-fetch / d3-force / d3-selection / d3-shape / d3-timer / d3-zoom | 各^3.x | **各パッケージとも3.x系が現行最新メジャーのため実質変更不要**(patch/minor更新のみ) | 3.x系が現行(d3本体v7ライン相当) | 基本なし | 無し〜小 | Vue/Nuxtのメジャー変更とは独立。Viteバンドル時のESM解決を確認する程度 | 単純更新(バージョン変更不要な可能性が高い) |
| debounce | 1.2.1 | 維持可 | 現行 | なし | 無し | - | 単純更新のみ |
| localStorage | 1.0.4 | 要確認(ブラウザ標準の`window.localStorage`で代替可能なら依存自体を撤去できる可能性) | - | - | 小 | - | 用途確認の上、撤去 or 単純更新 |

---

## 世代間依存関係の要点(重視事項)

```
Nuxt 4系 (現行安定版)
  ├─ Vue 3系 必須
  │    ├─ vue-router 4系 必須(Nuxt4に内蔵)
  │    ├─ Pinia 3系(vuex後継、公式推奨)
  │    └─ vuetify 3系 必須(@nuxtjs/vuetify(Vue2専用)は使用不可 → vuetify-nuxt-module)
  ├─ ビルドエンジン: Vite/Rollup(webpack+babel構成を置換)
  ├─ サーバーエンジン: Nitro(カスタムExpress統合の設計見直しが必要)
  └─ Lint: @nuxt/eslint(ESLint9 flat config前提、@nuxtjs/eslint-config は非対応)
```

- Nuxt・Vue・Vuetify・vue-router・状態管理(Pinia)は**同時に1グループとして更新する必要がある**。Nuxtだけ、あるいはVueだけを個別に上げることはできない。
- ESLint9移行はNuxt本体の移行(@nuxt/eslint採用)とタイミングを合わせるのが最も摩擦が少ない。
- Babel撤去・@babel/node撤去はNuxt本体のビルドエンジンがVite化されることで自然に解消される(個別に先行して撤去する動機は薄い)。
- Express/Nitroの統合方針は最も設計判断を要する箇所(現状のカスタムサーバー構成を維持するか、Nitro標準に寄せるか)。

---

## 方針決定(ユーザー決定事項)

- **Nuxt本体の移行先: Nuxt4系**に移行する
- **サーバー構成: 現段階ではExpress維持**(Nitroへの統合は今回のスコープに含めない)

### Express維持に伴う技術的リスク(要フォローアップ)

Nuxt3/4は内部的にNitro(h3)ベースであり、Nuxt2の`Builder`/`nuxt.render`のような公式Express統合APIは存在しない。Express維持を選んだ場合、以下は別途技術検証が必要:

- Nuxt4の`.output`ビルド、またはNitroハンドラ(`toNodeListener`等)をExpressのmiddlewareとして組み込む具体的な方法の確定(公式サポート外のワークアラウンドになる可能性が高い)
- `npm run dev`時のHMR/Vite dev middlewareがExpress経由でも機能するかの検証(CLAUDE.mdの「bind mountで即時反映」運用方針との整合性確認)
- 将来Nitro統合に切り替える際の移行しやすさを損なわない構成にできるか

## 決定事項(詳細化済み)

### v-data-table スロットAPI書き換え範囲(確定)

対象は **`components/TableDiagrams.vue` の1ファイルのみ**。`hide-default-header`+`v-slot:header`/`v-slot:item`で完全にカスタム描画しており、Vuetify2の名前付きカラムスロット(`item.columnName`等)は未使用のシンプルな構造。変更点は4つ:

1. `header_row`のヘッダー定義: `{ text, value, sortable, link }` → `{ title, key, sortable, link }`(Vuetify3のプロパティ名変更)
2. `<template v-slot:header="{ props }">` → `<template v-slot:headers="{ columns }">`(スロット名が複数形`headers`に変更、`props.headers`→`columns`)
3. `<template v-slot:item="props">` → `<template v-slot:item="{ item }">`(`props.item`→`item`)。`Object.keys(props.item)`部分は`Object.keys(item)`に変更するだけで内部ロジックは維持可能
4. `dense`プロパティ → `density="compact"`(Vuetify3で`dense`ブール属性が`density`プロパティに統一)

`router-link`の使用(Vue Router経由)自体は変更不要。

### nuxt-env → runtimeConfig 移行方針(確定)

対象は **`nuxt.config.js`(モジュール登録)と`components/AppAPICommon.vue`(1箇所)のみ**。`NETOVIZ_REST_PORT`はブラウザ実行時にREST APIの接続先ポートを上書きするためのランタイム値(ビルド時定数ではない)であり、Nuxt標準の`runtimeConfig.public`がそのまま代替可能。

1. `nuxt.config.js`: `nuxt-env`モジュール登録を削除し、以下を追加
   ```js
   runtimeConfig: {
     public: {
       netovizRestPort: process.env.NETOVIZ_REST_PORT || ''
     }
   }
   ```
2. `components/AppAPICommon.vue`: `this.$env.NETOVIZ_REST_PORT` → `this.$config.public.netovizRestPort`(Options APIコンポーネントでも`$config`でruntimeConfigにアクセス可能なため、Composition API化は不要)
3. 副次的に`@nuxtjs/dotenv`モジュールと`nuxt.config.js`冒頭の`require('dotenv').config()`も撤去可能(Nuxt4は`.env`を標準で読み込むため)
4. `head`トップレベル設定 → Nuxt4では`app.head`にネストする形式に変更(`nuxt.config.js`全体をCJS(`module.exports`)からESM(`export default defineNuxtConfig({...})`)に書き換える一連の作業に含める)

### Express維持時のNuxt4統合方法(確定)

Nuxt2時代の「ExpressがNuxtを内包する」方向(`app.use(nuxt.render)`)はNitroアーキテクチャには存在しない。しかし**逆方向**——「NitroがExpress Routerを内包する」方向は、h3(Nitroの内部エンジン)が公式に提供する`fromNodeMiddleware`ユーティリティと、Nitroの標準拡張ポイント`server/plugins/`(`defineNitroPlugin`)で実現できる。非公式ワークアラウンドではなく正規の拡張方法。

**構成:**

```js
// server/plugins/express-api.js (新規、Nitro server plugin)
import { fromNodeMiddleware } from 'h3'
import apiRouter from '../api/rest/index.js'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.router.use('/api', fromNodeMiddleware(apiRouter))
})
```

- `server/api/rest/index.js`(Express Router、`express.json()`、`req`/`res`ベースの既存コード)、`server/api/rest/integrator.js`、`server/api/common/api-base.js`、`server/api/common/alert-util.js`は**変更不要**。「Express維持」はこのルーター/ミドルウェア層でそのまま実現される
- 廃止対象は`server/index.js`(Expressアプリ起動・`Builder(nuxt).build()`・`app.listen()`)のみ。この起動処理はNitroが引き継ぐ
- `nuxt dev`はNitro標準のdevサーバーであり、HMR/Vite dev middlewareがそのままフルに機能する。CLAUDE.mdの「bind mountで即時反映」運用方針と整合する
- `babel-node`起動方式(`@babel/node`依存)は不要になり撤去できる
- `PORT`/`NETOVIZ_WEB_LISTEN`環境変数は、Nitroが認識する環境変数(`PORT`/`HOST`または`NITRO_PORT`/`NITRO_HOST`)へのマッピング調整が必要
- 「Express維持」の意味は、「Expressがサーバー全体をホストする」から「Express Router形式の既存コードはそのまま使い続けるが、HTTPサーバーのホストはNitroに委ねる」に修正される

参考:
- [Server Engine · Nuxt Concepts v4](https://nuxt.com/docs/4.x/guide/concepts/server-engine)
- [Nitro · Nuxt Kit v4](https://nuxt.com/docs/4.x/api/kit/nitro)
- [Best way to load an h3 router + middleware from node_modules dependency in Nuxt4? · nuxt/nuxt · Discussion #34213](https://github.com/nuxt/nuxt/discussions/34213)

## 未確定事項

現時点で残っている大きな未確定事項はなし。すべての主要な設計判断(Nuxt4移行、Express維持方針とその技術的実現方法、v-data-table書き換え範囲、nuxt-env→runtimeConfig移行)が確定した。

---

## Part C. メジャーバージョンを跨ぐ変更の詳細調査(コード変更範囲)

> 実際のファイル内容を確認した上での確定情報。まだコード変更は行っていない。

### C-1. Nuxt (2.18.1 → 4系)

| 影響ファイル | 旧API・旧記法 | 新しい代替方法 | 修正規模 | 依存関係 |
|---|---|---|---|---|
| `nuxt.config.js` | `module.exports = {...}`(CJS)、`head: {...}`(トップレベル)、`buildModules`/`modules`の分離、`build.extractCSS`/`build.babel.configFile`、`vuetify: {}`、`modules: ['@nuxtjs/axios', 'nuxt-env']` | `export default defineNuxtConfig({...})`、`app: { head: {...} }`、`modules: [...]`のみに統合、Vite設定(babel設定は原則不要)、`vuetify-nuxt-module`設定、`runtimeConfig.public` | 大(全面書き換え) | Vuetify/Axios/nuxt-env/Babelの各変更とすべて連動する起点ファイル |
| `pages/index.vue` | `head: () => ({ title: 'Index: ...' })` | `useHead({ title: '...' })`(コンポーネントの`setup()`内、または`<script setup>`) | 小 | Nuxt本体移行に付随 |
| `pages/about.vue` | 同上(`head()`オプション、未読だが同様の構造と推定) | 同上 | 小 | 同上 |
| `pages/model/_network/_snapshot/_modelFile.vue` | ①ファイル名`_network/_snapshot/_modelFile`(アンダースコア動的ルート)、②`head() { return {...} }`、③`this.$nuxt.$route.query`/`this.$nuxt.$route.params` | ①`[network]/[snapshot]/[modelFile].vue`にリネーム、②`useHead()`、③`this.$route.query`/`this.$route.params`(Nuxt3/4のOptions APIには`$nuxt`ラッパーが存在せず`$route`が直接注入される) | 中(ファイル名変更+API変更) | ディレクトリ構成変更(Nuxt4は`app/`配下必須の可能性、後述) |
| `layouts/default.vue` | `$nuxt.$route.path`、`<nuxt />`コンポーネント、非同期コンポーネント定義`() => ({ component: import('~/components/TableAlerts') })` | `$route.path`、`<NuxtPage />`、`defineAsyncComponent(() => import('~/components/TableAlerts'))` | 中 | Vue3化・Vuetify3化と同時に手を入れる箇所(同ファイル内に`v-app-bar dense dark`もある) |
| `layouts/error.vue`(未読、存在確認済み) | Nuxt2の`layouts/error.vue`によるエラーページ機構 | Nuxt3/4はルート直下の`error.vue`+`useError()`/`clearError()`に変更 | 中 | 独立した変更(他への依存は薄い) |
| ディレクトリ構成全体 | Nuxt2フラット構成(`pages/`, `layouts/`, `components/`, `store/`が直下) | Nuxt4は既定で`app/`配下(`app/pages/`, `app/layouts/`, `app/components/`)へ移動が既定構成(`srcDir`設定で回避も可能) | 大(ファイル移動作業。ロジック変更ではない) | 全ファイルパスに影響するため他の全変更の前提になりうる |

### C-2. Vue (2.7.16 → 3系)

| 影響ファイル | 旧API・旧記法 | 新しい代替方法 | 修正規模 | 依存関係 |
|---|---|---|---|---|
| `components/VisualizeDiagramCommon.vue`(mixin) | `beforeDestroy() {...}`ライフサイクルフック | `beforeUnmount() {...}` | 小(フック名のみ) | 7個のVisualize*コンポーネントすべてがこのmixinを継承しているため、1箇所の修正で全体に反映される |
| `store/index.js`, `store/alert.js` | Vuexのファイルベースモジュール規約(`export const state = () => ({...})`, `export const mutations = {...}`) | Pinia `defineStore('main', {...})` / `defineStore('alert', {...})`(C-5のVuex→Piniaで詳述) | 中 | Vue3化と同時に行うのが合理的(Vuex4はVue3対応するが公式にPinia移行が推奨) |
| `layouts/default.vue`, `components/TableAlerts.vue`, `components/TableDiagrams.vue`, `components/TableVisualizers.vue`, `components/VisualizeDiagramDistance.vue`, `components/VisualizeDiagramNested.vue` | `import { mapState, mapMutations } from 'vuex'` | `import { mapState, mapActions } from 'pinia'` (Piniaのヘルパー) | 中(6ファイル、呼び出し方は近い) | store本体の書き換え(上記)が前提 |
| `components/TableAlerts.vue`, `components/VisualizeDiagramCommon.vue` | `this.$store.watch((state) => state.alert.alertHost, callback)` | Piniaでは`watch(() => store.alertHost, callback)`(`watch`はVue3 Composition API、Options APIコンポーネントでも`import { watch } from 'vue'`で利用可能)、または`store.$subscribe` | 小〜中(2箇所) | Pinia移行に付随 |
| 全体(mixinsパターン7箇所) | `mixins: [AppAPICommon]` / `mixins: [AppAPICommon, VisualizeDiagramCommon]` | Vue3でも`mixins`オプションは引き続きサポートされるため**変更不要**(そのまま動作する見込み) | なし(オプション改善のみ、今回スコープ外) | - |

### C-3. Vuetify (2.7.2 + @nuxtjs/vuetify 1.12.3 → vuetify 3系 + vuetify-nuxt-module)

| 影響ファイル | 旧API・旧記法 | 新しい代替方法 | 修正規模 | 依存関係 |
|---|---|---|---|---|
| `nuxt.config.js` | `buildModules: ['@nuxtjs/vuetify']`, `vuetify: {}` | `modules: ['vuetify-nuxt-module']`, `vuetify: { moduleOptions, vuetifyOptions }` | 中 | Nuxt本体移行と同時実施が必須(`@nuxtjs/vuetify`はNuxt3/4非対応) |
| `components/TableDiagrams.vue` | `hide-default-header`、`v-slot:header="{ props }"` + `props.headers`、`v-slot:item="props"` + `props.item`、`header_row`の`{ text, value, sortable }` | `v-slot:headers="{ columns }"`、`v-slot:item="{ item }"`、`{ title, key, sortable }`(既にPart Bで確定) | 中(1ファイル、4か所) | 独立した変更 |
| `layouts/default.vue` | `<v-app-bar app dense dark>` | `dense`ブール属性は`density="compact"`に統一。`dark`ブール属性はVuetify3では個別コンポーネントから廃止され、テーマ切り替え(`useTheme()`)または`theme="dark"`属性に変更 | 小〜中(要動作確認) | Vuetify3全体の移行に付随 |
| `components/VisualizeDiagramCommon.vue` | `this.$vuetify.breakpoint.width` / `this.$vuetify.breakpoint.height`(SVGサイズ計算に使用、D3描画に直結) | `this.$vuetify.display.width` / `this.$vuetify.display.height`(Vuetify3で`breakpoint`→`display`に名称変更) | 小(2プロパティ名変更だが、全Visualize系のSVGサイズ計算の起点なので**動作確認は重要**) | 全Visualize*コンポーネントの描画サイズに影響するため優先的に検証すべき箇所 |
| `components/VisualizeDiagramDistance.vue`, `Nested.vue`, `Dependency.vue`, `Dependency2.vue` | `v-resize="resizeSVG"`ディレクティブ | Vuetify3でも`v-resize`ディレクティブは提供されている見込みだが、個別に動作確認が必要 | 小(要検証) | `$vuetify.display`変更後のSVGリサイズ処理と合わせて確認 |
| `components/VisualizeDiagramNested.vue` | `v-switch inset`、`v-text-field type="number" min="1"`、`v-btn rounded color="info"` | Vuetify3でも同名propsは概ね存続するが、`rounded`の値仕様(boolean→サイズ文字列)や`v-switch`のデフォルトスタイルの見た目変化を確認 | 小(見た目の確認中心、ロジック変更なし) | 独立した変更 |
| `components/TableVisualizers.vue` | `v-list`, `v-subheader`, `v-list-item-group`, `v-list-item` | Vuetify3で`v-list-item-group`は廃止され、`v-list`の`v-model:selected`で選択状態を管理する方式に変更。`v-subheader`→`v-list-subheader`にリネーム | 中(コンポーネント構造の変更を伴う可能性) | 独立した変更だが実装時に要検証 |

### C-4. @nuxtjs/axios (5.13.6 → 撤去)

| 影響ファイル | 旧API・旧記法 | 新しい代替方法 | 修正規模 | 依存関係 |
|---|---|---|---|---|
| `package.json` | `"@nuxtjs/axios": "^5.13.6"`(dependencies) | 依存を削除 | 小 | なし |
| `nuxt.config.js` | `modules: ['@nuxtjs/axios', ...]`, `axios: {}` | 該当行を削除 | 小 | Nuxt本体移行作業に含める |
| コンポーネント側 | (使用箇所0件、確認済み) | 変更不要。既存の生`fetch()`(`layouts/default.vue`)をそのまま使用継続 | なし | なし |

### C-5. Express (4.22.2、維持方針)

| 影響ファイル | 旧API・旧記法 | 新しい代替方法 | 修正規模 | 依存関係 |
|---|---|---|---|---|
| `server/index.js` | Express app生成、`Builder(nuxt).build()`、`app.use(nuxt.render)`、`app.listen(httpPort, host)`(Nuxt2の`Builder`/`nuxt.render`はNuxt3/4に存在しない) | ファイル自体を削除。HTTPサーバーのホストはNitroに委譲 | 大(ファイル削除) | Babel撤去(`@babel/node`起動方式の廃止)と直結 |
| `server/plugins/express-api.js`(新規) | (該当なし、新規追加) | `defineNitroPlugin((nitroApp) => { nitroApp.router.use('/api', fromNodeMiddleware(apiRouter)) })` | 中(新規ファイル、ロジックは既存Routerの再利用) | `server/api/rest/index.js`の`apiRouter`をそのままimportする前提 |
| `server/api/rest/index.js`, `integrator.js`, `server/api/common/api-base.js`, `alert-util.js` | `express.Router()`, `express.json()`, `req.params`, `req.body`, `res.type()/res.send()` | **変更不要**(h3の`fromNodeMiddleware`がExpress Routerをそのままラップするため、Router内部のExpress的な書き方は維持される) | なし | 新規`express-api.js`プラグインが前提 |
| `package.json` scripts(`dev`/`start`) | `nodemon server/index.js --watch server --exec "babel-node"`、`babel-node server/index.js` | `nuxt dev`、`nuxt build && node .output/server/index.mjs`(またはNuxt4標準の`nuxt start`相当コマンド) | 中(起動コマンドの再定義) | Babel撤去と連動 |
| 環境変数(`PORT`/`NETOVIZ_WEB_LISTEN`) | `server/index.js`内で`nuxt.options.server.host/port`を明示的に読んで`app.listen()` | Nitroが認識する環境変数(`PORT`/`HOST`または`NITRO_PORT`/`NITRO_HOST`)へのマッピング調整。`nuxt.config.js`の`devServer`/`nitro`設定で明示することも可能 | 小〜中 | Docker/docker-compose側の環境変数受け渡しにも影響しうる(playground全体の`demo_vars`等は本リポジトリ外) |

### C-6. Babel (撤去)

| 影響ファイル | 旧API・旧記法 | 新しい代替方法 | 修正規模 | 依存関係 |
|---|---|---|---|---|
| `babel.config.js` | `presets: ['@babel/env', ['@nuxt/babel-preset-app', {...}]]`, `plugins: [...]` | ファイル削除。Nuxt4のビルドはVite(esbuild/Rollup)が担い、`@nuxt/babel-preset-app`はNuxt2専用のため存在しない | 大(ファイル削除) | Nuxt本体のビルドエンジン変更に完全従属 |
| `package.json` dependencies/devDependencies | `@babel/node`, `@babel/core`, `@babel/eslint-parser`, `@babel/plugin-syntax-dynamic-import`, `@babel/preset-env`, `@babel/plugin-proposal-private-property-in-object` | すべて削除 | 小(削除のみ) | ESLint設定変更(`@babel/eslint-parser`の除去)と連動 |
| `package.json` scripts(`dev`/`start`) | `babel-node`経由の起動(C-5参照) | `nuxt dev`等に置換 | 中 | C-5(Express)と同一の変更 |
| `.eslintrc.js` | `parserOptions.parser: '@babel/eslint-parser'` | ESLint9移行時に`vue-eslint-parser`(Vueファイル用、既存構成でも実質使用されている)ベースの設定に統一、Babelパーサ指定は撤去 | 小 | ESLint9移行(C-7)と同時実施 |

### C-7. ESLint (8.57.1 → 9系, flat config)

| 影響ファイル | 旧API・旧記法 | 新しい代替方法 | 修正規模 | 依存関係 |
|---|---|---|---|---|
| `.eslintrc.js` | `module.exports = { root, env, parserOptions, extends: ['@nuxtjs', 'prettier', 'plugin:prettier/recommended'], rules: {...} }` | `eslint.config.js`(flat config、ESM)。`@nuxt/eslint`モジュールが提供する`createConfigForNuxt()`をベースに、既存のカスタムrules(`vue/v-bind-style`等)をマージする形に書き換え | 大(設定ファイルの全面書き換え、ルール内容自体は概ね移植可能) | Nuxt本体移行(`@nuxt/eslint`モジュール導入)と同時実施 |
| `package.json` devDependencies | `@nuxtjs/eslint-config`, `@nuxtjs/eslint-module`, `eslint-config-prettier`(8.x), `eslint-plugin-prettier`(4.x) | `@nuxt/eslint`、ESLint9対応版の`eslint-config-prettier`/`eslint-plugin-prettier`(各最新) | 中 | 上記と同一 |
| `nuxt.config.js` | `buildModules: ['@nuxtjs/eslint-module']` | `modules: ['@nuxt/eslint']`(開発時のみ有効化するオプションも用意されている) | 小 | Nuxt本体移行作業に統合 |
| `package.json` scripts(`lint`/`lint:fix`) | `eslint --ext .js,.mjs,.vue --ignore-path .gitignore .` | ESLint9 flat configでは`--ext`オプションは不要(`eslint.config.js`の`files`グロブで対象拡張子を指定)。`--ignore-path .gitignore`も`ignores`フィールドに統合される可能性 | 小(コマンド簡略化) | `.eslintrc.js`→`eslint.config.js`移行と同時 |
| prettier本体 | `prettier ^2.8.8`, `prettier-config-standard ^5.0.0` | `prettier ^3.x`。`prettier-config-standard`がPrettier3対応か要確認(非対応の場合は設定の作り直しが必要) | 小〜中 | ESLint9のflat config(`eslint-config-prettier`)と組み合わせて使用 |

---

## 全体の依存関係(変更の実施順序への影響)

- **C-1(Nuxt)とC-6(Babel)は不可分**: Nuxt4のビルドエンジン変更がBabel撤去の直接原因であり、同時に実施する必要がある
- **C-1(Nuxt)とC-5(Express)は`server/index.js`の廃止を介して連動**: Nuxt本体のサーバーエンジンがNitroになることで、C-5のExpress統合方法(`server/plugins/`)が初めて成立する
- **C-2(Vue)とC-3(Vuetify)は完全従属**: Vuetify3はVue3必須のため、Vue3化前にVuetify3化はできない
- **C-2(Vue)とVuex→Pinia(C-2内で言及)は同時実施が合理的**: 両方ともstore関連コンポーネント(6ファイル)を書き換えるため、まとめて行うことで手戻りを減らせる
- **C-7(ESLint)はC-1/C-6の完了後が自然**: `@nuxt/eslint`モジュールの導入はNuxt4本体構成が固まった後に行うのが摩擦が少ない
- **C-4(Axios)は他への依存が無く独立して先行実施可能**(使用箇所が無いため、いつ削除しても影響がない)

---

## Part D. 移行戦略の比較

> 実装はまだ行わない。戦略の比較検討のみ。

### 前提として効く制約

- テストコードが存在しないため、動作確認は常に**手動でのブラウザ確認**(5種のビジュアライザー: forceSimulation/dependency/dependency2/nested/distance + REST API 3エンドポイント)に依存する
- Part Cの調査で確定した通り、**Nuxt / Vue / Vuetify / vue-router / (Vuex→)Pinia は技術的に不可分な1グループ**であり、この中だけを個別に段階分割することはできない(Nuxt4はVue3必須、Vuetify3はVue3必須)
- Babel撤去・Express統合(`server/plugins/`化)はNuxt本体のビルドエンジン(Vite/Nitro)が前提のため、コアグループの移行が完了するまで着手できない

### A. Node.jsと依存パッケージを段階的に更新する

「段階的」が実際に適用できるのは、コアグループ(Nuxt/Vue/Vuetify等)の**外側にある独立パッケージ**に限られる(Node24対応、@nuxtjs/axios削除、d3-*系の確認、consola/dotenv/debounce/cross-envの更新、ESLint単独更新など)。コアグループ自体は不可分なため、Aだけでは最終形に到達できず、いずれBの作業が必要になる。

| 観点 | 内容 |
|---|---|
| メリット | 各ステップの変更が小さく都度動作確認しやすい(テスト不在との相性が良い)。問題発生時の原因特定が容易。ロールバックが容易 |
| デメリット | 最終的にNuxt/Vue/Vuetifyの一体移行という「大きな一撃」は避けられず、Aだけでは解決しない。フェーズ分割の管理コスト(PR数・レビュー回数)が増える |
| リスク | 過渡期に「Node24 + 旧Nuxt2/Babel構成」という未検証の組み合わせで運用する期間が生じる。特にCLAUDE.md記載の`.mjs`化不可の制約(`@babel/register`依存)がNode24でどう振る舞うか不明なまま先行させることになる |
| 作業量 | 総量はBと同等(むしろ分割管理コストが乗り僅かに増える) |
| 動作確認のしやすさ | 高い(各ステップが独立して検証可能) |

### B. Nuxt/Vue/Vuetifyを含めてまとめて新しい世代へ移行する

コアグループが技術的に不可分である以上、これを「まとめて」行うのは実質的に唯一の選択。調査結果(Part A〜C)によれば、Vue2固有APIの使用は`beforeDestroy`1箇所・mixins(変更不要)・v-data-table1ファイルなど**想定より限定的**であり、一体移行のコスト自体はそれほど大きくない。

| 観点 | 内容 |
|---|---|
| メリット | 中途半端な非動作状態を作らずに済む。Nuxt4のpackage.json全体で依存関係(peerDependencies)を一度で整合させられる。Vue2固有API使用が限定的なため想定より軽い |
| デメリット | 変更差分が大きい単一の作業期間になり、レビュー・動作確認の負荷が高い。テスト不在のため「何が壊れたか」の切り分けが難しい(5種ビジュアライザーを都度手動で全確認する必要) |
| リスク | 作業中は該当ブランチが長期間ビルド不可/動作不可になりうる(フィーチャーブランチ運用必須)。差分が大きい分、レビュー時に見落としが発生しやすい |
| 作業量 | Aと総量は同等だが、一つの作業期間に集中する |
| 動作確認のしやすさ | 低い(個々の変更が何に影響したかの切り分けが難しい)。ただし「コアグループが動くか否か」の結論は中間状態を作らない分早く出る |

### C. このリポジトリに適した方法(ハイブリッド、提案)

AとBはどちらも単独では最適ではない。**「不可分な部分だけをBのように一括で行い、その前後で独立した変更はAのように分割する」**ハイブリッドが本リポジトリに最も適する。

1. **Phase 0(独立変更の先行実施、Aのアプローチ)**: `@nuxtjs/axios`削除(無風)、Node.js 24対応確認(Dockerfile/`.nvmrc`追加/`engines`更新)、d3-*系・consola・dotenv等の周辺パッケージ確認。**Babel/ESLintの移行はここでは行わない**(次段のNuxt本体移行と結合しているため)
2. **Phase 1(コアグループの一体移行、Bのアプローチ、フィーチャーブランチ必須)**: Nuxt4 + Vue3 + Vuetify3(vuetify-nuxt-module) + vue-router4 + Vuex→Piniaを1つの作業単位として移行。5種のビジュアライザーを**1つずつ順に手動確認**しながら進める(`VisualizeDiagramCommon`mixinの`beforeUnmount`化や`$vuetify.display`変更は全ビジュアライザー共通なので最初に直し、以後は個別コンポーネントのVuetify3差分のみ確認すればよい)
3. **Phase 2(Nuxt本体確定後に着手、Phase1に従属)**: Babel撤去、Express統合(`server/plugins/express-api.js`化)、ESLint9移行(`@nuxt/eslint`)。Phase1でNitroベースの構成が固まってから着手するため手戻りが少ない
4. **Phase 3(仕上げ)**: Prettier3、Dockerfile/`CMD`の起動コマンド更新、GitHub Actionsの調整、ドキュメント(CLAUDE.md)更新

| 観点 | 内容 |
|---|---|
| メリット | 低リスクな変更を先に済ませて足場を固めつつ、不可分な部分は中途半端な状態を作らずに一括処理できる。各Phaseの完了時点で動作確認のチェックポイントを設けられる |
| デメリット | Phase構成の設計・管理そのものに一定のオーバーヘッドがある(ただし複雑さはA/Bそれぞれの欠点より小さい) |
| リスク | Phase1(コアグループ移行)の作業量・リスクはBと同水準のまま残る(これは技術的制約上避けられない)。Phase0を先行させても、Phase1のリスクを直接下げるわけではない(準備が整うだけ) |
| 作業量 | A・Bと総量はほぼ同じ。Phase分割による管理コストは小さく抑えられる(不可分な部分だけをBにするため分割数自体が少ない) |
| 動作確認のしやすさ | Phase0/2/3は高い(小さい変更、独立検証可能)。Phase1はBと同様に難易度が残るが、「5種のビジュアライザーを1つずつ確認する」という手順を決めておくことで難易度を下げられる |

### 提案する移行手順(まとめ)

```
Phase 0: 独立変更の先行実施
  - @nuxtjs/axios 削除
  - Node.js 24 対応確認(Dockerfile更新、動作確認)
  - d3-*/consola/dotenv等 周辺パッケージ確認
  ↓ (ここで一度動作確認・コミット)

Phase 1: コアグループの一体移行(フィーチャーブランチ)
  - Nuxt4 + Vue3 + Vuetify3 + vue-router4 + Pinia
  - 共通基盤(VisualizeDiagramCommon mixin, $vuetify.display等)を先に修正
  - 5種のビジュアライザーを1つずつ手動確認(forceSimulation→dependency→dependency2→nested→distance)
  - TableDiagrams.vue(v-data-table)、TableVisualizers.vue(v-list-item-group)を確認
  ↓ (Nuxt4上で全ビジュアライザーが動作することを確認してからマージ)

Phase 2: サーバー/Lintの移行(Phase1完了後)
  - Babel撤去、起動コマンド変更
  - server/plugins/express-api.js によるExpress統合
  - ESLint9(@nuxt/eslint)移行
  ↓

Phase 3: 仕上げ
  - Prettier3、Dockerfile CMD更新、GitHub Actions調整、CLAUDE.md更新
```

Phase0とPhase1の間、Phase1とPhase2の間はそれぞれ独立してコミット・動作確認のチェックポイントにできるため、テストコードが無い本リポジトリでも問題発生時の切り分けがしやすい構成になっている。
