# Netoviz — CLAUDE.md

## プロジェクト概要

RFC 8345 ベースのネットワークトポロジ JSON を可視化する Web アプリ。
姉妹ツール [Netomox](https://github.com/corestate55/netomox) がトポロジデータ (`topology.json`) を生成する。

## 技術スタック

- **Frontend**: Nuxt 4 (Vue 3) + Vuetify 4 (`vuetify-nuxt-module`) + Pinia + D3.js
- **Backend**: Nitro (Nuxt標準サーバーエンジン) + Express Router。既存の Express Router (`server/api/rest/`) は
  `server/plugins/express-api.js` で h3 の `fromNodeMiddleware` を介して Nitro にマウントしている
  (サーバーサイドで RFC8345 JSON を各 Diagram 用 JSON に変換して返す処理自体は変更なし)
- **実行環境**: Node.js ≥ 24 / Docker (node:24-alpine)
- **Lint/Format**: ESLint 10 (flat config, `@nuxt/eslint`) + Prettier 3
  (`eslint.config.mjs` は `.nuxt/eslint.config.mjs` を import する。`.nuxt/` を消した状態で
  `npm run lint` を実行するとエラーになるため、`npm install` の `postinstall` (`nuxt prepare`) で
  自動生成している)

## Vuetify2→4移行の既知の落とし穴

`npm run dev`/`build` やcurlでの疎通確認だけでは検出できず、実ブラウザでのクライアント側実行
(hydration・クリック操作)で初めて表面化する類の不具合があるため、UIを変更した際は
ヘッドレスブラウザ(Playwright等)での確認を推奨する。

- **`v-data-table` の `#headers` スロット**: スロット内で独自に `<thead>` を書くと、
  Vuetify側が用意する`<thead>`と二重にネストされ不正なHTMLになる(hydration mismatchの原因)。
  スロット内は `<tr>` から書き始める。
- **`v-data-table` の `headers` prop / `v-breadcrumbs` の `items` prop**: Vuetify2の
  `{ text, value, disable }` は Vuetify4 で `{ title, key, disabled }` にリネームされている。
- **`vuetify-nuxt-module` の `useLayout` 自動import**: デフォルト(`moduleOptions.importComposables: true`)では
  Vuetifyの `useLayout` がグローバル自動importされ、Nuxt4組み込みの `useLayout`(`#app/composables/layout`)と
  名前が衝突し `[NUXT_B6002]`/`Duplicated imports` 警告が出る。本リポジトリでは `useLayout` を未使用のため、
  `nuxt.config.js` の `vuetify.moduleOptions.importComposables` を明示的な配列にして除外している。

## 開発コマンド

```bash
cp dot.env .env          # 初回のみ。NETOVIZ_WEB_LISTEN=3000 が設定される
npm install              # 依存パッケージインストール (postinstallで`nuxt prepare`が自動実行される)
npm run dev              # 開発サーバー起動 → http://localhost:3000
npm run lint             # ESLint チェック
npm run lint:fix         # ESLint 自動修正
npm run format           # Prettier フォーマット
npm run build            # 本番ビルド
npm run start            # 本番起動
npm run docker-build     # Docker イメージビルド
```

## テスト

プロジェクト独自のテストコードは存在しない。動作確認は実際にアプリを起動して行う。

## ビジュアライザー種別

| 名前 | 概要 |
|---|---|
| `forceSimulation` | レイヤーごとのフォース・シミュレーション図 |
| `dependency` | 垂直レイアウトの依存関係図 |
| `dependency2` | 水平レイアウトの依存関係図 (TP 展開/折りたたみ対応) |
| `nested` | ネスト図 (グリッドレイアウト保存対応、最も複雑) |
| `distance` | 距離図 |

`dependency` と `dependency2` は同じ情報を異なる表現で可視化するもので、どちらも現役。

## 重要な設計ルール

### データファイル
- `static/model/<network>/<snapshot>/topology.json` が入力データ。通常は外部からマウント/配置する。
- リポジトリ内の `static/model/` はサンプルデータ。
- `static/model/_index.json` はモデル一覧。このリポジトリの外で管理される (自動生成なし)。
- `static/model/<network>/<snapshot>/layout.json` はネスト図のグリッドレイアウト。git 管理下 (サンプルデータとして保持)。

### URL とファイルパスの対応
- スナップショット名に含まれる `/` は URL で `__` にエンコードされる (`snapshotUrlEncode`/`snapshotUrlDecode`、`lib/util/model-link.js`)。
- スナップショット名に `__` を含むと衝突するため使用不可。
- `/model`・`/model/:network`・`/model/:network/:snapshot` はそれぞれ network 一覧・snapshot 一覧・
  モデルファイル/visualizer 一覧を表示するドリルダウンページ(`pages/model/**/index.vue` +
  `components/Table{Networks,Snapshots,ModelFiles}.vue`)。これにより `AppBreadcrumbs.vue` が生成する
  パンくずの各セグメントが実在するルートになり、vue-router4 の `VUE_ROUTER_R0004` 警告が解消されている。

### フロント・バックエンドの依存
- `lib/diagram/` (フロントエンド) が `server/graph/common/base.js` を直接 import している。
- バンドルやテスト追加の際はこの依存関係に注意。
- **`server/api/` 配下は `lib/diagram/` から import 不可**: Nuxt4 は「Vueアプリ側コードから
  `server/(api|routes|middleware|plugins)/` 配下を import すること」を `vite:import-analysis` プラグインで
  明示的に禁止している(`server/graph/` 等それ以外のサブディレクトリは対象外)。
  そのため `splitAlertHost`(元は `server/api/common/alert-util.js`)は
  `lib/diagram/common/alert-util.js` に複製して使っている。Nuxt公式は`shared/`ディレクトリの使用を
  推奨するが、本リポジトリの docker-compose bind mount(playground側、このリポジトリ外)が
  既存ディレクトリのみを対象にしているため、新規トップレベルディレクトリの追加を避けて複製方式を採用した。
  `server/api/` 配下のロジックを `lib/diagram/` から使いたくなった場合は複製するか、
  bind mount設定側に `shared/` を追加した上で移設すること。

### オブジェクト ID
- `LL NNN TTT` 形式の数値 ID (ネットワーク×100000 + ノード×1000 + TP×1)。
- 上限を超えると衝突するため、大規模トポロジでは注意。

## Docker 運用方針

`Dockerfile` の `CMD` は意図的に `npm run dev` (開発モード)。
コードをボリュームマウントして変更を即時反映する運用のため。

- イメージサイズ削減のため `npm install` は `--omit=dev` で実行している(eslint/prettier/jsdoc等の
  lint/format/doc生成専用ツールのみを除外)。
- **`package.json` の `dependencies`/`devDependencies` 分類に注意**: `nuxt.config.js` の `modules` に
  登録されている Nuxt モジュール(`vuetify-nuxt-module`、`@nuxt/eslint` 等)や、`npm run dev` の
  起動自体に必要なパッケージ(`vite`、`sass-embedded`)は、実際にはlintツールではなく
  **`npm run dev` 実行に必須**のため `dependencies` に置く必要がある。`devDependencies` に置くと
  `--omit=dev` インストール時に `nuxt prepare`/`nuxt dev` が
  `The module xxx could not be loaded. It may not be installed.` で失敗する
  (新規Nuxtモジュールを追加する際は同様の注意が必要)。

### SCSS の `@use` 移行

`lib/style/` 配下は Dart Sass の `@import` 廃止(3.0.0で削除予定)に対応済み。`color-schema.scss` の
変数/`%placeholder` を参照するファイルは `@use './color-schema' as *;`(グローバルスコープで参照する
既存の挙動を維持するため名前空間を展開)、CSS出力のみが目的のファイルは `@use './xxx';` を使う。
新規にSCSS変数/placeholderを参照するファイルを追加する場合もこのパターンに従うこと。

## ツールチップ属性の拡張方法

マウスオーバー時のノード属性表示を拡張する場合、変更が必要なのは
`server/graph/rfc-model/node-attr/` 内の対応する属性クラス 1ファイルのみ。

1. コンストラクタに新フィールドを追加 (`this.xxx = data.xxx || null`)
2. `toHtml()` に表示ロジックを追加

`ForceSimulationNode` や `tooltip-creator.js` など他ファイルへの変更は不要。
属性オブジェクトはパイプライン全体を透過的に通過し、フロントエンドで `class` フィールドを元に再構築される設計のため。

## サーバー統合 (Nitro + Express Router) の注意点

Nuxt4 は Nitro (h3) ベースのサーバーエンジンを持ち、Nuxt2 の `Builder`/`nuxt.render` の
ような「Express に Nuxt をマウントする」方式は存在しない。本リポジトリでは逆方向の
「Nitro に既存の Express Router をマウントする」構成を `server/plugins/express-api.js` で実現している。

- `server/api/rest/` 配下の Express Router (`express.Router()`, `express.json()`, `req`/`res`) 自体は変更不要。
- h3 v2 の `nitroApp.router.use(path, handler)` は **Express のような prefix マウントではなく厳密一致**。
  そのため `/api/**` のワイルドカードパターンで登録し、かつ内部で薄い Express app
  (`express().use('/api', apiRouter)`) を1枚挟んで `/api` prefix の strip を再現している
  (`fromNodeMiddleware` は受け取ったパスをそのまま渡すため、Express Router 単体だと
  `/models` ではなく `/api/models` として解釈されてしまい、ルートが一致しない)。
- `server/index.js` (Nuxt2 時代の Express エントリポイント、`babel-node` 起動) は廃止済み。
  起動は `nuxt dev` / `node .output/server/index.mjs` (`npm run dev`/`start` 経由)。
