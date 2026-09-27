# netoviz テスト実装計画

> **実施状況 (2026年実施):** Phase 1〜3 は実装・コミット済み。Phase 4 (D3/DOM smoke test 等の
> 任意・低優先度項目) は着手しないことを決定した。以下の「## 実施結果」セクションに実際の
> テストファイル一覧・計画との差分・実装中に見つかった既知の挙動をまとめている。
> Phase 1〜3 本文はそのまま計画時点の記録として残す。

## Context

netoviz (`repos/netoviz`) は RFC8345 トポロジ JSON を可視化する Nuxt4/Vue3 + Vuetify4 + Pinia + D3
アプリだが、現状テストコードもテスト基盤も一切存在しない (`package.json` に test スクリプトなし、
jest/vitest 等の依存もなし)。CLAUDE.md にも「プロジェクト独自のテストコードは存在しない。動作確認は
実際にアプリを起動して行う」と明記されている。

このプロジェクトはサーバー側 (`server/graph/` の RFC8345→各種ダイアグラム変換ロジック) に
D3/DOM に依存しない**純粋なロジック**が大量にある一方、フロントエンドは D3 で直接 SVG DOM を
操作する部分が多く、全体を一様にテストするのはコストに見合わない。そこで「テストしやすく壊れると
実害が大きい純粋ロジック」を優先し、D3 描画の詳細は引き続き手動確認に委ねる、という現実的な方針で
ゼロからテスト基盤を導入する。

## 1. テスト基盤のセットアップ

- **テストランナー: Vitest** を新規導入する。Vite ベース (Nuxt4 は内部で Vite 8 を使用) で
  相性が良く、ESM/プレーン JS のみのプロジェクト構成 (TypeScript 未使用) にも追加設定なしで合う。
- 追加パッケージ (すべて `devDependencies` — `npm run dev`/`build`/`start` の実行に不要なので
  CLAUDE.md が指摘する「Nuxt モジュールを devDependencies に置くと `--omit=dev` で壊れる」問題には
  該当しない):
  `vitest`, `@vue/test-utils`, `@pinia/testing`, `happy-dom`, `@vitest/coverage-v8`, `supertest`
  (REST ルートの統合テスト用)。
  `@nuxt/test-utils` は今回のスコープ (unit/component 中心) では不要と判断し導入しない。
- 設定ファイル: リポジトリルートに `vitest.config.js` を新規作成。
  - デフォルト `test.environment: 'node'`。Vue コンポーネントテストのファイルのみ
    `// @vitest-environment happy-dom` を先頭に付けて DOM 環境に切り替える (毎テストで DOM を
    ロードするコストを避ける)。
  - `test.include: ['**/*.test.js']`、`test.exclude` に `node_modules`, `.nuxt`, `.output`, `static` を追加。
- `package.json` に追加するスクリプト:
  ```json
  "test": "vitest run",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage"
  ```
- ファイル配置規約: **テスト対象と同じディレクトリに `*.test.js` を co-locate** する
  (例: `server/graph/common/base.test.js`, `lib/util/model-link.test.js`)。`__tests__/` ミラー構成より
  シンプルで、Vite/Vitest コミュニティの標準的な作法。

## 2. フェーズ別テスト計画

### Phase 1 — 純粋ロジック (最優先・最も費用対効果が高い)

**サーバー側 (`server/graph/`, `server/api/common/`)**
- `server/graph/common/base.test.js` — `sortUniq`/`flatten` の基本ケース。
- `server/graph/common/diff-element.test.js`, `diff-state.test.js` — `DiffState.detect()` の
  各分岐、`_camelToKebabCase()`、`findDiffDataByPath()`/`findAllDiffDataMatchesPath()`、
  `diffDataForObjectArray()` を diff 行のパターン別にテーブル駆動でテスト。
- `server/graph/common/family-maker.test.js`, `neighbor-maker.test.js` — 3〜5 ノード程度の
  合成 node/link 配列を用意し `markFamilyWithTarget`/`markNeighborWithTarget` の付与結果を検証。
- `server/graph/rfc-model/topology.test.js` — 自作の最小 RFC8345 fixture (`rfc-l2`/`rfc-l3`/
  `mddo-l1` 混在) で `RfcTopology` の `newNetwork()` が正しいサブクラスにディスパッチすることを検証。
- ID 採番方式 (`network.js:118`, `node.js:63`, `term-point.js:57` の `LL NNN TTT` 算術) を
  テーブル駆動でピン留め。
- `server/graph/force-simulation/topology.test.js`, `dependency/topology.test.js`,
  `nested/topology.test.js` (`deep-topology.js`/`aggregated-topology.js`), `distance/topology.test.js`
  — 各 `toXxxTopologyData()` に小さな fixture を通し `toData()` の出力形を検証。
- `server/graph/nested/link-creator.test.js`, `inter-tp-link.test.js` — 最もロジック密度が高い
  ファイル。`isSkewVertical/Horizontal/Slash/Backslash`、`isOverlap`、既知座標に対する
  `represent3Points`/`represent4Points`/`circledCornerPolyline` などの生成文字列をテーブル駆動で検証。
- `server/api/common/alert-util.test.js` — `splitAlertHost` (詳細は §4)。

**フロントエンド (`lib/`)**
- `lib/util/model-link.test.js` — `snapshotUrlEncode`/`snapshotUrlDecode` の通常ケースに加え、
  **最初の `/`/`__` しか置換しない非対称な挙動** (`'a/b/c'` → `'a__b/c'`) を明示的にテストし、
  現状の挙動を仕様としてピン留めする。`visualizerLinksForModelFile` は `stores/main.js` の
  5 種類の visualizer 定義に対する `{text,value,link}` 出力を検証。
- `lib/diagram/common/alert-util.test.js` — サーバー側と同じ共有ケーステーブルで検証 (§4)。
- `lib/diagram/nested/link-creator.test.js`, `inter-tp-link.test.js` — サーバー側と同等のテスト
  (実装が別ファイルとして重複しているため、fixture は共有しつつアサーションは各ファイルに書く)。
- `lib/diagram/force-simulation/position-cache.test.js` — `PositionCache` の save/load を
  `happy-dom` 環境の `localStorage` (または `vi.stubGlobal`) でテスト。

### Phase 2 — REST API 統合テスト

対象: `server/api/rest/index.js`, `server/api/common/api-base.js` (`APIBase`), `RESTIntegrator`。

- `APIBase` はコンストラクタで `distDir` を受け取り `modelDir = ${distDir}/model` を導出するため、
  テストでは `static` の代わりに fixture ディレクトリ (`test/fixtures/model`) を渡し、本物の
  サンプルデータには一切触れない。
- `server/api/common/api-base.test.js` — `getModels()` の成功/失敗 (ファイル欠如 → `null`) パス、
  `getGraphData()` の `graphName` ディスパッチ (4 種類全て) を検証。
- `server/api/rest/index.test.js` — `supertest` で Express Router に直接リクエストを送る形で:
  - `GET /api/models` の 200/エラーパス
  - `GET /api/graph/:graphName/:network/:snapshot/:jsonName` (最低 1 graphName で 200 + 形状検証)
  - `POST /api/graph/:graphName/:network/:snapshot/:jsonName` — **唯一のファイル書き込みを伴う
    ルート**。`fs.mkdtemp` 等でテストごとに一時ディレクトリへ fixture をコピーしてから実行し、
    リポジトリにコミットされた `test/fixtures/` 自体を汚さない。**本物の `static/model/` を
    書き込み先にしてはならない。**

### Phase 3 — 単純な Vue コンポーネントテスト

- `components/AppBreadcrumbs.test.js` — Pinia 不要、`path` prop のみに依存。単一/複数セグメント、
  前後スラッシュのエッジケースをテーブル駆動で検証。
- `components/TableNetworks.test.js`, `TableSnapshots.test.js`, `TableModelFiles.test.js` —
  `createTestingPinia({ initialState: { main: { modelFiles: [...] } } })` で 2 ネットワーク×2
  スナップショット程度の合成データを注入し、`v-data-table` は `stubs` で潰した上で
  computed (`tableRows` 等) の出力を直接検証する (Vuetify の実描画までは検証しない)。
- `components/VisualizeDiagram.test.js` — `visualizer` prop の 5 種類 + 不正値で、正しい子
  コンポーネント (または `NotFound`) が選ばれることを検証。5 つの `VisualizeDiagram*` 子コンポーネント
  自体は `stubs` で潰し、D3 に依存する `mounted()` が実行されないようにする。
- `pages/model/**/*.vue`、`stores/main.js`/`stores/alert.js` 単体、5 つの `VisualizeDiagram*`
  ラッパーコンポーネント本体は Phase 3 では対象外 (後述)。

### Phase 4 — 任意・低優先度

- `lib/diagram/*/builder.js`/`operator.js`、`common/diagram-base.js` 等 D3-DOM 密結合部分への
  ごく少数の smoke test (「fixture データで構築・トップレベル描画メソッド呼び出しが例外を投げない」程度)。
- `layouts/default.vue` の `fetch('/api/models')` → `setModelFiles` の呼び出し検証。
- `*/visualizer.js` (d3-fetch 経由のオーケストレーション) — 優先度低いためスキップ推奨。

## 3. Fixture 戦略

- 新規ディレクトリ **`test/fixtures/`** をリポジトリルートに作成する。`static/model/` は
  CLAUDE.md 上「サンプルデータ (このリポジトリ外で管理)」と位置付けられているため、そこを変更・
  汚染しない。
  - `test/fixtures/rfc8345/` — 自作の最小 RFC8345 JSON (`minimal-l2.json`, `minimal-l3.json`,
    `mixed-layers.json` (rfc-l2+rfc-l3+mddo-l1 混在), 必要であれば `mddo-ospf-bgp.json`)。
    小さく手書きすることで、想定するエッジケース (複数レイヤー種別の混在など) を確実にカバーしつつ
    アサーションを読みやすく保てる。
  - `test/fixtures/model/<network>/<snapshot>/{topology.json,layout.json,_index.json}` —
    Phase 2 の REST 統合テスト用に `static/model/` と同じディレクトリ構造を模倣。
- 既存の `static/model/**/topology.json` から最小サイズのもの (~67KB) を 1〜2 個選び、
  「パイプライン全体を通して例外なく妥当な形の出力が得られるか」という粗い statement のみを
  検証する統合テストに読み取り専用で利用する (書き込み・fixture へのコピーはしない)。
  当該サンプルファイルが環境によって存在しない可能性 (例: `static/model/_index.json` は現状
  このチェックアウトに存在しない) を踏まえ、`it.skipIf(!fs.existsSync(...))` 等でガードする。

## 4. 重複する `alert-util.js` の扱い

`server/api/common/alert-util.js` と `lib/diagram/common/alert-util.js` は CLAUDE.md により
実装の重複が意図的に維持されている (Nuxt4 が `server/api/` からのクライアント側 import を禁止する
ため)。実装は共有できないが、**テストケースは共有できる**:

- `test/fixtures/alert-util-cases.js` に `splitAlertHostCases` (2分割/3分割/その他 (falsy含む) の
  各パターンの `{input, expected}` 配列) をエクスポート。
- 両方の `alert-util.test.js` がこのケーステーブルを import し `it.each` で自身の実装に対して
  実行することで、2実装の挙動を意図せず乖離させないようにする。

## 5. 優先度を下げる/対象外とするもの

- **D3 による SVG 描画そのもののビジュアルリグレッションテスト** — jsdom+D3 の重いモック、
  または実ブラウザでの視覚差分検証が必要になり投資対効果が低い。CLAUDE.md が既に「実アプリ起動での
  手動確認」を運用方針としているため、自動テストはこれを置き換えるのではなく補完する位置づけとする。
- **アプリ全体の E2E ブラウザテスト** (ページ遷移・実 API 呼び出し・実描画) — `@nuxt/test-utils` +
  Playwright + 実 Nitro サーバーが必要になる大きな投資。まずは Phase 1〜3 で十分な回帰検出力が
  得られるか見極めてから検討する。
- `*/visualizer.js`、`pages/**/*.vue`、`stores/*.js` 単体テストは低優先度 (上記参照)。

## 6. CI について

`.github/workflows/actions.yaml` は Docker イメージのビルド&プッシュのみを行っており、
lint/test 相当のステップは現状存在しない。Phase 1/2 がある程度揃った段階で `npm test` を
CI ステップとして追加するのは容易だが、**本計画のスコープ外**とし、今回は着手しない。

## 検証方法

- 各フェーズ実装後: `npm run test` (Vitest) で該当テストが green であることを確認。
- `npm run test:coverage` でカバレッジ傾向を確認し、Phase 1 の純粋ロジック群が高カバレッジに
  なっていることを確認する (D3-DOM 密結合部分は意図的に対象外のためカバレッジ低下は許容)。
- 既存の `npm run lint` が新規テストファイルに対しても通ることを確認 (ESLint flat config は
  `**/*.test.js` も対象に含まれる想定なので、必要なら `eslint.config.mjs` に vitest globals
  (`describe`/`it`/`expect` 等) 用の設定追加を検討する)。
- REST 統合テスト (Phase 2) 実装後は、実際に `docker compose up -d` で netoviz を起動し、
  `/api/models`・`/api/graph/...` を手動で叩いて本物の `static/model/` に対する挙動が
  テストと矛盾しないことを一度確認する。

## 実施結果

Phase 1〜3 を実装・コミット済み(`npm run test` で17ファイル・101テストすべてgreen)。
Phase 4 は着手しないことを決定した(D3/DOM smoke test 等の任意・低優先度項目のため)。

### コミット

- Phase 1: Vitest導入 + サーバー側純粋ロジックのテスト
- Phase 2: REST API 統合テスト
- Phase 3: Vue コンポーネントテスト
- `.dockerignore` にテスト関連ファイル (`*.test.js`, `test/`, `vitest.config.mjs`) の除外を追加

### 実際のテストファイル一覧

**サーバー側**
- `server/graph/common/base.test.js`
- `server/graph/common/diff-element.test.js`
- `server/graph/common/diff-state.test.js`
- `server/graph/common/family-maker.test.js`
- `server/graph/common/neighbor-maker.test.js`
- `server/graph/rfc-model/topology.test.js` (ID採番・layerディスパッチ)
- `server/graph/force-simulation/topology.test.js`
- `server/api/common/alert-util.test.js`
- `server/api/common/api-base.test.js`
- `server/api/rest/integrator.test.js` (dependency/nested/distance変換 + `postGraphData`の書き込み)

**フロントエンド**
- `lib/util/model-link.test.js`
- `lib/diagram/common/alert-util.test.js`
- `components/AppBreadcrumbs.test.js`
- `components/TableNetworks.test.js`
- `components/TableSnapshots.test.js`
- `components/TableModelFiles.test.js`
- `components/VisualizeDiagram.test.js`

**fixture**
- `test/fixtures/rfc8345/mixed-layers.json` (自作の最小 RFC8345、rfc-l2 + rfc-l3)
- `test/fixtures/alert-util-cases.js` (2つの `alert-util.js` 実装で共有するテストケーステーブル)
- `test/fixtures/model/` (REST API 統合テスト用、`static/model/` と同じディレクトリ構造)

計画で挙げていた `server/graph/nested/link-creator.js`/`inter-tp-link.js`(および `lib/diagram/nested/` 側の
重複コピー)、`dependency`/`nested`/`distance` 個別の `topology.test.js`、`position-cache.js` は
今回のスコープでは未実装(Phase 1 の中でも優先度が下がる箇所として見送った)。

### 計画からの主な変更点

- **`supertest` は結局未導入**。`server/api/rest/index.js` はモジュール内で
  `new RESTIntegrator('static')` を固定でハードコードしており、supertest 経由で叩くと本物の
  `static/model/` にしかアクセスできず fixture が使えないため、`index.js` 自体は変更せず
  `RESTIntegrator`/`APIBase` を fixture の distDir で直接インスタンス化してテストする方式に変更した。
- Phase 3 の Vue コンポーネントテストでは、`createTestingPinia` に `createSpy: vi.fn` の指定が
  必須(未指定だと `PINIA_TESTING_C0001` エラー)。また VTU の自動 stub タグ名は単語ごとに
  ハイフン区切りになる (`VisualizeDiagramForceSimulation` → `visualize-diagram-force-simulation-stub`)。
- `NotFound.vue` 内で使われる `v-row`/`v-alert`/`router-link` はテスト内であえて stub 登録せず、
  Vueの「未解決コンポーネントは素のカスタム要素としてフォールバックレンダリングされる」挙動を
  利用してスロット内容(メッセージ文言)をそのまま検証できるようにした。

### 実装中に見つかった既知の挙動 (未修正)

`server/graph/dependency/node.js` の `DependencyNode` は `super(nodeData)` 経由で
`ForceSimulationNode` を継承するが、そのコンストラクタは `family` プロパティをコピーしないため、
`markFamilyWithTarget` が生の `ForceSimulationNode` に付与した `family` が
`DependencyNode.toData()` の出力(`toDependencyTopologyData()` の JSON レスポンス)に反映されず、
常に `family: undefined` になる。target による絞り込み自体(生ノード側の `.family` を参照している)
は正しく機能しているため実害は表示上のみだが、フロントエンドが `family` フィールドを利用する
実装を追加する場合は要注意。`server/api/rest/integrator.test.js` はこの現状の挙動
(絞り込みは効くが `family` は出力されない)をそのままピン留めしている。詳細は
[architecture.md の「変更時の注意点」](./architecture.md)を参照。
