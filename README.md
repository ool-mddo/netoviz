# Netoviz

Netoviz (**Ne**twork **To**pology **Vis**ualizer) は、
[RFC 8345](https://datatracker.ietf.org/doc/rfc8345/) に基づくネットワークトポロジデータを
ブラウザ上でインタラクティブに可視化する Web アプリケーションです。

姉妹ツール [Netomox (Network topology modeling toolbox)](https://github.com/corestate55/netomox)
がトポロジデータ (`topology.json`) を生成します。

このリポジトリ ([ool-mddo/netoviz](https://github.com/ool-mddo/netoviz)) は
[corestate55/netoviz](https://github.com/corestate55/netoviz) からのフォークで、
[ool-mddo/playground](https://github.com/ool-mddo/playground) の一構成要素として運用されています。
アーキテクチャの詳細は [docs/architecture.md](docs/architecture.md) を参照してください。

## 技術スタック

- **Frontend**: Nuxt 4 (Vue 3) + Vuetify 4 (`vuetify-nuxt-module`) + Pinia + D3.js
- **Backend**: Nitro (Nuxt標準サーバーエンジン) + Express Router
  (既存の Express Router を `server/plugins/express-api.js` 経由で Nitro にマウントする構成。
  詳細は [docs/architecture.md](docs/architecture.md) を参照)
- **実行環境**: Node.js ≥ 24
- **Lint/Format**: ESLint (flat config, `@nuxt/eslint`) + Prettier
- **テスト**: Vitest (方針は [docs/testing-plan.md](docs/testing-plan.md) を参照)

## セットアップ

```bash
cp dot.env .env          # 初回のみ (NETOVIZ_WEB_LISTEN=3000 が設定される)
npm install               # postinstall で `nuxt prepare` が自動実行される
```

## 起動

```bash
# 開発サーバー
npm run dev               # → http://localhost:3000

# 本番ビルド + 起動
npm run build
npm run start
```

## Docker

```bash
npm run docker-build      # または docker build -t netoviz/allinone .
docker run -p3000:3000 --name nv-allinone netoviz/allinone
```

`Dockerfile` の `CMD` は意図的に `npm run dev` (開発モード) になっています。
コードをボリュームマウントして変更を即時反映する運用を前提としているためです
(単体で本番運用する場合は `CMD` を `npm run start` に変更し、事前に `npm run build` してください)。

GitHub Actions ([.github/workflows/actions.yaml](.github/workflows/actions.yaml)) により、
push のたびに `ghcr.io/ool-mddo/netoviz:<ref>` としてイメージがビルド・公開されます。

## テスト・Lint・Format

```bash
npm run test              # Vitest 実行 (1回)
npm run test:watch        # Vitest 実行 (watch モード)
npm run test:coverage     # Vitest 実行 (カバレッジ付き)

npm run lint               # ESLint チェック
npm run lint:fix           # ESLint 自動修正
npm run format              # Prettier フォーマット
```

## ドキュメント生成 (JSDoc)

```bash
npm run doc
```

## ディレクトリ構成

- `lib/diagram/`: 可視化ライブラリ (フロントエンド)
- `server/graph/`: RFC8345 データモデル・変換ロジック
- `server/api/rest/`: REST API (Express Router)
- `static/model/`: トポロジデータ (`topology.json` 等)。
  各ネットワークのトポロジデータは [Netomox](https://github.com/corestate55/netomox) で生成される
  ([netomox-examples](https://github.com/corestate55/netomox-examples) も参照)。
- `fig/`: [UML class diagram](./fig/classes_js.png)

## アプリケーション URL

- 図の表示: `/model/:network/:snapshot/:modelFile[?visualizer=:visualizer]`
- モデル一覧 (ドリルダウン)
  - `/model` : ネットワーク一覧
  - `/model/:network` : スナップショット一覧
  - `/model/:network/:snapshot` : モデルファイル/ビジュアライザー一覧

## REST API

([server/api/rest/index.js](server/api/rest/index.js) 参照)

- GET `/api/models`
  トポロジモデル一覧を返す ([static/model/_index.json](./static/model/_index.json))
- GET `/api/graph/:graphName/:network/:snapshot/:jsonName`
  RFC8345 ベースのトポロジモデルから変換した図データを返す
- POST `/api/graph/:graphName/:network/:snapshot/:jsonName`
  レイアウトを保存する (nested 図用)
- GET `/api/models/status?file=<network>/<snapshot>/<file>`
  `_index.json` と指定モデルファイルの変更シグネチャ (`mtimeMs-size`、存在しなければ `null`) を返す。
  自動リロードのポーリング用 (`file` はスナップショット中の `/` を `__` にしても可)

## 自動リロード

`_index.json` や表示中の `topology.json` が更新されると、画面右上の "Auto reload" スイッチが ON のとき
(既定 ON、`localStorage` に保存) 手動リロードなしで反映される。
5 秒間隔で `/api/models/status` をポーリングし、同じ新シグネチャが 2 回連続で観測された時点
(書き込み途中の回避) で、`_index.json` ならモデル一覧を再取得、表示中の topology.json なら
ページを再マウントして再描画する (ズーム等の描画状態は保持されない)。
タブが非表示の間はポーリングしない。

## 参考リンク

フォーク元 [corestate55/netoviz](https://github.com/corestate55/netoviz) の開発時に書かれた記事です。
Nuxt 2 時代の内容を含むため、現在の実装とは差異がありますが、背景や設計思想の参考として残しています。

デモ動画
- [Batfish を使ってネットワーク構成を可視化してみよう - YouTube](https://www.youtube.com/watch?v=YKKWg7Ap6H8)

ブログ
- [Batfish を使ってネットワーク構成を可視化してみよう (1) - Qiita](https://qiita.com/corestate55/items/8a39af553785fd77c20a)
- [Batfish を使ってネットワーク構成を可視化してみよう (2) - Qiita](https://qiita.com/corestate55/items/9d8023eb19637f9bbd1e)
- [Batfish を使ってネットワーク構成を可視化してみよう (3) - Qiita](https://qiita.com/corestate55/items/10673ef74c33a24a0389)
- [モデルベースのNW図で差分を可視化する - Qiita](https://qiita.com/corestate55/items/8c50b4f6cbee4caa0cbc)
- [ネットワーク構成図のレイアウト処理を考えてみる (1) - Qiita](https://qiita.com/corestate55/items/9a1194cdb2c54d80c08e)
- [ネットワーク構成図のレイアウト処理を考えてみる (2) - Qiita](https://qiita.com/corestate55/items/849b8a204e24a2e7a8fb)
- [Batfish を使ってネットワーク構成を可視化してみよう・改 - Qiita](https://qiita.com/corestate55/items/fb18066d1105010758d9)

スライド
- [「ネットワーク図」のモデル化とモデルを起点にした自動化の可能性 / onic2018 - Speaker Deck](https://speakerdeck.com/corestate55/onic2018)
- [ここまでできる! 設定ファイルからのネットワーク構成可視化 / npstudy17 - Speaker Deck](https://speakerdeck.com/corestate55/npstudy17)
