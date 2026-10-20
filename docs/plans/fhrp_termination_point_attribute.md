# Plan: layer3 TP の `fhrp` (VRRP/HSRP) 属性をツールチップに表示する

(状態: 実装済み (ブランチ `v0.10.0-dev`、未コミット))

### 確認事項の決定 (2026-10-11)

- 表示形式: `FHRP:` の下に 1 グループ 1 行。
- diff の取得処理: `DiffState#diffDataForArrayElement` として共通メソッドに追加 (既存の `diffDataForObjectArray` は変更しない)。
- 実環境の確認: 一時的に Playwright を使う (リポジトリに依存は追加しない)。

### 実装結果

- 追加: `server/graph/rfc-model/tp-attr/mddo-fhrp.js` (`MddoFhrp`)
- 変更: `server/graph/rfc-model/tp-attr/mddo.js` (`MddoL3TermPointAttribute` に `fhrp`、`toHtml` に `FHRP:` 項目)、
  `server/graph/common/diff-state.js` (`diffDataForArrayElement`)
- fixture: `test/fixtures/rfc8345/mddo-l3-fhrp.json`
- spec 追加 (33 tests): `mddo-fhrp.test.js` (8)、`mddo-l3-term-point-attribute-fhrp.test.js` (12)、`diff-state-array-element.test.js` (10)、
  `force-simulation/topology-fhrp.test.js` (3)
- docs 更新: `CLAUDE.md` (ツールチップ属性の拡張方法)、`docs/architecture.md` (TP 属性の主要フィールド)、`docs/testing-plan.md`
- 確認:
  - `npm run test`: 142 tests passed (従来 109 + 33)。`npm run lint`: 新規の指摘なし (既存の警告 1 件のみ)。
  - 実環境 API: `GET /api/graph/forceSimulation/mddo-fw/original_asis/topology.json` で、`fhrp` を持つ layer3 TP が 12 個
    (`attribute.class` = `MddoL3TermPointAttribute`、`fhrp` の要素は camelCase のプロパティ)。nested の図用 JSON にも `fhrp` が載る。
  - 実ブラウザ (Playwright + `/usr/bin/google-chrome`。スクラッチパッドで実行し、リポジトリに依存は追加していない):
    `http://localhost:3000/model/mddo-fw/original_asis/topology.json?visualizer=forceSimulation` で `site-b-cr-1` の `ge-0/0/2.0` を
    mouseover すると、ツールチップに `FHRP:` と `VRRP group 1: Virtual Address: 192.168.101.1, Priority: 150, Preempt: true,
    Source Address: 192.168.101.2/24, Active: true` が表示される。`fhrp` のない `ge-0/0/0.0` のツールチップは従来どおり (`FHRP` なし)。
  - diff 表示の実環境確認は行っていない (unit test で Hashdiff の 4 パターンを検証。実環境確認が必要なら一時的な topology.json を用意する)。

playground の `docs/work/plans/fhrp_termination_point_attributes.md` の Phase F に相当する。全体計画・データモデルはそちらを参照。
この文書は netoviz 側の実装範囲を扱う。

## 目的

topology.json の `mddo-topology:l3-termination-point-attributes` に載る `fhrp` (VRRP/HSRP のグループ情報) を、
layer3 の TP にマウスオーバーしたときのツールチップに表示する。
スナップショット差分表示 (diff) のときは、`fhrp` の追加・削除・変更も他の属性と同様に色で示す。

## 前提 (リポジトリ状態)

- ブランチ: `main` (`32a8945`、`origin/main` と同期) から **`v0.10.0-dev`** を作成済み。
- netoviz は topology.json (JSON) を読むだけで、netomox gem には依存しない。ローカルのテストに netomox の差し替えは不要。
- ベースライン: `npm run test` は **109 tests passed**、`npm run lint` は既存の警告 1 件 (`max-len` の未使用 disable ディレクティブ。今回の対象外)。
- playground のコンテナでは `server/`, `lib/`, `components/` などが bind mount されているので、ソース編集が即反映される。
  現在の `topologies/mddo-fw/original_asis` と `emulated_asis` の layer3 に `fhrp` を持つ TP が 12 個ある (実環境確認に使える)。

## 調査結果

### データの流れ

1. サーバー (Nitro + Express Router): `server/graph/rfc-model/model/mddo-l3.js` が layer3 の TP を作るとき
   `new MddoL3TermPointAttribute(data[attrKey] || {})` で属性クラスを生成する。
   (`data` は topology.json の TP 属性 = kebab-case の JSON キー)
2. 属性オブジェクトは force-simulation / nested などの図用データへ**そのまま (JSON として) 渡る**。
3. ブラウザ: `lib/diagram/common/tooltip-creator.js` が `node.attribute.class` (`'MddoL3TermPointAttribute'`) から
   属性クラスを選び、`new AttrClass(node.attribute).toHtml()` で HTML を作る。

→ 変更が必要なのは `server/graph/rfc-model/tp-attr/` の属性クラスだけ (CLAUDE.md の「ツールチップ属性の拡張方法」と同じ構造)。
`tooltip-creator.js` の `AttributeClassOf` へ登録するのはトップレベルの属性クラスのみで、入れ子のサブ属性クラスは登録不要
(`MddoOspfNeighbor` も未登録)。

### 注意すべき点

1. **入れ子オブジェクトは JSON 往復後の形でも受ける必要がある。**
   サーバー側で `new MddoFhrp(kebab-case の JSON)` した値は、JSON として図データに載りブラウザで再構築される。
   そのとき入れ子の値は**クラスのプロパティ名 (camelCase)** になっているので、コンストラクタは両方のキー
   (`group-id` と `groupId` 等) を受け付ける (`MddoOspfNeighbor` が `router-id` / `routerId` を両方受けるのと同じ)。
   値が `false` / `0` になりうる項目 (`preempt`, `active`, `priority`) は `||` ではなく `??` で扱う。
2. **既存の配列要素の diff 取得 (`DiffState#diffDataForObjectArray`) は `fhrp` の「値の変更」に使えない。**
   netomox の差分 (Hashdiff) は次の形で出る。
   - TP 属性に `fhrp` キーが新規追加 / 削除: `['+' / '-', 'fhrp', [ {…}, … ]]` (パスは `fhrp`、値は配列)
   - 要素の追加 / 削除: `['+' / '-', 'fhrp[1]', {…}]`
   - 要素内の値の変更: `['~', 'fhrp[0].priority', 150, 100]` (パスは `fhrp[0].priority`)
   - 要素内の配列の変更: `['+' / '-', 'fhrp[0].virtual-address[0]', '192.168.101.1']`
   `diffDataForObjectArray('fhrp', 0)` は正規表現 `fhrp\[0]` に一致する要素が 1 件のとき「単一オブジェクトの追加/削除」とみなして
   `Object.keys(ddAll[0])` を取る。`~` のパス `fhrp[0].priority` に一致する場合は ddAll[0] が数値 / 文字列なので、意図しない結果 (空 / 文字の添字) になる。
   (OSPF neighbor の `~` でも同じ制約があるが、今回は `fhrp` の値変更 (priority 等) を正しく表示したいので別処理を用意する。)
3. 表示したいフィールドは 7 つ: `protocol`, `group-id`, `virtual-address` (配列), `priority`, `preempt`, `source-address`, `active`。
4. トップレベルの既存の TP 属性 (`Description`, `IP Address`, `Flag`) の表示は変えない。`fhrp` を持たない TP のツールチップは従来と同一にする。

## 表示イメージ

`fhrp` を持つ layer3 TP (例: `site-b-cr-1` の `ge-0/0/2.0`):

```
<tp path>
- Description: to_site-b-seg1
- IP Address: 192.168.101.2/24
- Flag:
- FHRP:
    - VRRP group 1: Virtual Address: 192.168.101.1, Priority: 150, Preempt: true, Source Address: 192.168.101.2/24, Active: true
```

- VRRP と HSRP が併存する場合は、`FHRP:` の下に 1 グループ 1 行で並べる。
- `protocol` は大文字 (`VRRP` / `HSRP`) で見出しにし、`group-id` と並べる。
- `fhrp` が空の TP には `FHRP:` の項目自体を出さない。
- diff 表示: 要素内の値が変わったら、その値を既存の表示規則 (追加 = 緑、削除 = 赤、変更 = 新旧並記) で示す。
  要素 / `fhrp` キー全体が追加・削除なら、その行 / `FHRP:` の見出しに追加・削除の色を付ける。

## 実装内容

### 1. `MddoFhrp` (新規): `server/graph/rfc-model/tp-attr/mddo-fhrp.js`

`MddoOspfNeighbor` と同じ構造 (`RfcAttributeModelBase` 継承)。

- プロパティ: `protocol` (string)、`groupId` (number)、`virtualAddress` (string[])、`priority` (number)、`preempt` (boolean)、
  `sourceAddress` (string)、`active` (boolean)。
- コンストラクタ: kebab-case / camelCase の両方を受け付ける。既定値は `protocol: ''`, `groupId: -1`, `virtualAddress: []`,
  `priority: 0`, `preempt: false`, `sourceAddress: ''`, `active: false` (netomox の既定値と同じ)。
- `toHtml(diffElements)`: `super.toHtml(diffElements)` (ダミー diff-state の設定) の後、1 グループ分を 1 つの `<li>` にする
  (`_toHtmlKeyValue` を使い、diff の色分けを他の属性と共通にする)。

### 2. `MddoL3TermPointAttribute` の拡張: `server/graph/rfc-model/tp-attr/mddo.js`

- `import MddoFhrp from '../tp-attr/mddo-fhrp'`、`MddoL3TermPointAttributeData` の typedef に `fhrp` を追加。
- コンストラクタ: `this.fhrp = (data.fhrp || []).map((f) => new MddoFhrp(f))` (OSPF の `neighbor` と同様)。
- `toHtml()`: `this.fhrp.length > 0` のときだけ `FHRP` の項目を出力する。
  各要素は `this._fhrpDiffElements(index)` で得た diff 要素を `MddoFhrp#toHtml` に渡す。
  `fhrp` キー全体が追加 / 削除されたとき用に、見出しの class を `_attrKeyClassString('fhrp', this.diffState.findDiffDataByPath('fhrp'))` で決める。

### 3. 配列要素の diff 取得: `server/graph/common/diff-state.js`

`fhrp` のような「オブジェクトの配列」要素の diff を取得する汎用メソッドを `DiffState` に追加する
(既存の `diffDataForObjectArray` は変更しない。OSPF neighbor の挙動を変えないため)。

```js
/**
 * Find diff-elements of an element of object-array attribute.
 * @param {string} path - array attribute path (e.g. 'fhrp')
 * @param {number} index - index of the element
 * @returns {Array<DiffElement>} diff-elements keyed by the element's attribute names (empty if no diff)
 */
diffDataForArrayElement(path, index)
```

返す diff 要素の `path` は要素内のキー (kebab-case。例: `priority`, `virtual-address`) にする。処理は 3 パターン:

1. 要素内の変更: パスが `<path>[index].<key>` (末尾に `[n]` が付く場合は `[n]` を除く) → `<key>` に書き換えた**新しい `DiffElement`** (元の `diffData` を破壊しない。
   既存の `findAllDiffDataMatchesPath` は `d.path` を書き換えるので使わない)。
   配列内の変更 (`virtual-address[0]` 等) は、そのキーの「変更」として扱う (要素単位ではなくキー単位で示す。制約として明記)。
2. 要素全体の追加 / 削除: パスが `<path>[index]` のとき、値のオブジェクトの各キーを、その追加 / 削除の diff 要素にする。
3. キー全体の追加 / 削除: パスが `<path>` で値が配列のとき、`index` 番目の要素の各キーを、その追加 / 削除の diff 要素にする。

### 4. ドキュメント以外の変更が不要な箇所

- `lib/diagram/common/tooltip-creator.js`: 変更不要 (サブ属性クラスは登録不要)。
- `server/graph/rfc-model/model/mddo-l3.js` ほか force-simulation / nested の変換: 変更不要 (属性を透過的に渡す)。実環境確認で図用 JSON に `fhrp` が載ることを確認する。
- スタイル (`lib/style/tooltip.scss`): 既存の `attr-key` / `attr-val` の added / deleted / changed クラスを使うので変更不要。

## テスト計画

既存の方針 (`docs/testing-plan.md`: vitest、`*.test.js` を対象ファイルの隣に置く、fixture は `test/fixtures/` に手書き) に合わせ、機能ごとの専用ファイルにする。

### fixture

- 新規 `test/fixtures/rfc8345/mddo-l3-fhrp.json`: `mddo-topology:l3-network` が 1 つ。ノード `cr1`, `cr2`、
  TP は (a) VRRP のみ (`ge-0/0/2.0`)、(b) VRRP と HSRP の併存、(c) `fhrp` なし。値は実データ (`site-b-cr-1`) に近いものにする。
- diff のテストは JSON fixture ではなく、`DiffState` / 属性クラスのコンストラクタに `_diff_state_` を直接渡して作る (Hashdiff の出力形式の 4 パターンを網羅)。

### spec

| ファイル | 内容 |
|---|---|
| `server/graph/rfc-model/tp-attr/mddo-fhrp.test.js` | `MddoFhrp`: kebab-case / camelCase 両方のキーを受け付ける、既定値、`false` / `0` を保持する (`??`)、JSON 往復 (`JSON.parse(JSON.stringify(obj))`) 後に再構築しても同じ値、`toHtml()` に protocol / group-id / virtual address / priority / preempt / source address / active が含まれる。 |
| `server/graph/rfc-model/tp-attr/mddo-l3-term-point-attribute-fhrp.test.js` | `MddoL3TermPointAttribute` + `fhrp`: (1) `fhrp` ありの `toHtml()` に `FHRP` と各グループが出る。(2) 複数グループ (VRRP + HSRP) が全て出る。(3) `fhrp` なしのとき `FHRP` が出ず、従来のツールチップと同一 (`Description` / `IP Address` / `Flag` のみ)。(4) ツールチップと同じ経路 (JSON 往復後に `new MddoL3TermPointAttribute(json)`) でも同じ HTML になる。(5) fixture を `RfcTopology` に通して、layer3 の TP の属性が `MddoFhrp` の配列を持つ。(6) diff: priority の値変更 (150 → 100) で新旧が並記される、グループの追加 / 削除で行に added / deleted の色、`fhrp` キー全体の追加 / 削除で見出しに色、`virtual-address` の変更でそのキーが changed、diff が無ければ色クラスが付かない。 |
| `server/graph/common/diff-state-array-element.test.js` | `DiffState#diffDataForArrayElement`: 上記 3 パターン (要素内の変更 / 要素全体の追加・削除 / キー全体の追加・削除)、`[n]` 付きパスの扱い、該当なしで空配列、元の `diffData` を書き換えない (呼び出し後も `path` が元のまま)、別インデックスの diff を混ぜない。 |
| `server/graph/force-simulation/topology-fhrp.test.js` | (実装時に既存の `topology.test.js` の書き方を確認して追加) fixture から force-simulation 用のトポロジを作ったとき、layer3 の TP ノードの `attribute` が `fhrp` (`class` は `MddoL3TermPointAttribute`) を保持する。図用データに `fhrp` が載ることの確認。 |
| 既存 spec | 変更しない。109 件が引き続き通ること。 |

実行:

```bash
cd /home/hagiwara/ool-mddo/playground/repos/netoviz
npm run test
npm run lint
```

## 動作確認 (実環境)

1. 現在 `topologies/mddo-fw/original_asis` / `emulated_asis` に `fhrp` がある (conduit は cr を含まないので無い)。
   netoviz (コンテナ。`localhost:3000`) は bind mount でソースの変更を反映する。必要なら `docker compose ... restart netoviz`。
2. API で図用 JSON に `fhrp` が載ることを確認する:
   `curl -s localhost:3000/api/graph/force-simulation/mddo-fw/original_asis/topology.json?...` を `jq` で検索
   (正確な URL は `docs/architecture.md` の REST API の項で確認する)。
3. ブラウザ (`localhost:3000`) で `mddo-fw` / `original_asis` の layer3 を開き、`site-b-cr-1` の `ge-0/0/2.0` の TP にマウスオーバーして
   `FHRP:` が表示されること、`fhrp` のない TP のツールチップが従来どおりであることを確認する。
   CLAUDE.md の注意 (UI 変更は実ブラウザで確認する) に従い、可能ならヘッドレスブラウザ (Playwright 等) でも確認する。
4. diff 表示: 2 つの snapshot で `fhrp` が違う場合の表示確認は、`fhrp` の有無を変えた topology.json を一時的に用意して確認する
   (リポジトリに残さない。unit test が主、実環境は補助)。

## ドキュメント修正の調査結果

| ファイル | 要否 | 内容 |
|---|---|---|
| netoviz `CLAUDE.md` (「ツールチップ属性の拡張方法」) | **要修正** | 現在は `node-attr/` のみの記述。`tp-attr/` も同様であること、入れ子の配列を持つ属性は**サブ属性クラスを作り kebab-case / camelCase の両方を受ける** (JSON 往復後に再構築されるため) こと、配列要素の diff は `DiffState#diffDataForArrayElement` を使うことを追記。 |
| netoviz `docs/architecture.md` (「ノード属性の主要フィールド」付近) | **要追記** | 「TP 属性の主要フィールド」として `MddoL3TermPointAttribute` (`description`, `flag`, `ipAddress`, `fhrp`) と `MddoFhrp` のフィールド表、ツールチップの表示、diff の扱いを追記。ディレクトリ構成の `tp-attr/` の説明に `mddo-fhrp.js` を追加。 |
| netoviz `docs/testing-plan.md` | 要追記 | fixture 戦略 (`test/fixtures/rfc8345/`) に `mddo-l3-fhrp.json` を追加、テスト一覧に fhrp 関連 spec を追記。 |
| netoviz `README.md` | 不要 | 属性・ツールチップの記述なし。 |
| `package.json` の version (`0.2.0`) | 変更しない | リリースタグ (v0.9.x) と連動しておらず、既存の運用に従う。 |
| playground `docs/work/plans/fhrp_termination_point_attributes.md` | 要更新 | Phase F の結果を反映。 |

## 実装ステップ (順序)

1. fixture 作成、`DiffState#diffDataForArrayElement` と spec (`diff-state-array-element.test.js`)。
2. `MddoFhrp` と spec (`mddo-fhrp.test.js`)。
3. `MddoL3TermPointAttribute` の拡張と spec (`mddo-l3-term-point-attribute-fhrp.test.js`、force-simulation の spec)。
4. `npm run test` / `npm run lint`。
5. 実環境確認 (API の JSON、ブラウザでの表示)。
6. ドキュメント更新 (`CLAUDE.md`, `docs/architecture.md`, `docs/testing-plan.md`, playground の計画)。
7. コミット。

## 確認したい点 (回答済み。上の「確認事項の決定」を参照)

1. **表示形式:** 上記イメージ (`FHRP:` の下に 1 グループ 1 行、`VRRP group 1: …`) でよいか。
2. **diff の取得処理:** 共通メソッド `DiffState#diffDataForArrayElement` として追加する案 (推奨) でよいか。
   それとも `MddoL3TermPointAttribute` 内のローカルな処理にとどめるか (他のクラスへの影響は無いが、共通化されない)。
3. **ヘッドレスブラウザでの確認:** Playwright は現在このリポジトリに入っていない。実環境確認を curl での JSON 確認 + 手元のブラウザでの目視にとどめるか、
   Playwright を一時的に使って確認するか (依存はリポジトリに追加しない)。
