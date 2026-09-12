# Netoviz — CLAUDE.md

## プロジェクト概要

RFC 8345 ベースのネットワークトポロジ JSON を可視化する Web アプリ。
姉妹ツール [Netomox](https://github.com/corestate55/netomox) がトポロジデータ (`topology.json`) を生成する。

## 技術スタック

- **Frontend**: Nuxt 2 (Vue 2) + Vuetify + D3.js
- **Backend**: Express + Nuxt (サーバーサイドで RFC8345 JSON を各 Diagram 用 JSON に変換して返す)
- **実行環境**: Node.js ≥ 22 / Docker (node:22-alpine)

## 開発コマンド

```bash
cp dot.env .env          # 初回のみ。NETOVIZ_WEB_LISTEN=3000 が設定される
npm install              # 依存パッケージインストール (必要なら --legacy-peer-deps)
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
- スナップショット名に含まれる `/` は URL で `__` にエンコードされる (`ssUrlDec` で復元)。
- スナップショット名に `__` を含むと衝突するため使用不可。

### フロント・バックエンドの依存
- `lib/diagram/` (フロントエンド) が `server/graph/common/base.js` を直接 import している。
- バンドルやテスト追加の際はこの依存関係に注意。

### オブジェクト ID
- `LL NNN TTT` 形式の数値 ID (ネットワーク×100000 + ノード×1000 + TP×1)。
- 上限を超えると衝突するため、大規模トポロジでは注意。

## Docker 運用方針

`Dockerfile` の `CMD` は意図的に `npm run dev` (開発モード)。
コードをボリュームマウントして変更を即時反映する運用のため。

## Node.js バージョンの注意点

サーバーエントリポイントは `server/index.js` (CJS)。`.mjs` (ネイティブ ESM) にすると `@babel/register` フックが効かず、Node 22 で起動失敗する。
