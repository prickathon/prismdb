# prismdb-csv2rdf

> CSVファイルをRDFへ変換するための処理を定義するディレクトリです

## Environment

- docker
- docker-compose

または

- node(新しめのやつ)
- npm(新しめのやつ)

## Usage

```bash
# 変換処理が実行されます
$ docker-compose -f ../docker-compose.csv2rdf.yml up
```

または

```bash
# 依存パッケージのインストール
$ npm i

# 環境変数を設定します
$ export BASE_URL=https://prismdb.takanakahiko.me

# 変換処理が実行されます
$ npm run start
```

## 仕様

まだまだ未完成かつ不完全な仕様です...
ツッコミやPRをいただけると有り難いです．

### 方針

- CSV編集者にRDF(Sparql)を意識させないようにする
- 場合によってはリポジトリを分離できるよう，結合度が低くなるようにする

### ファイルの種類

`_data/` 内にあります．
それぞれの利用方法については次項にあります．

- `XXXX.csv` : プライマリのデータ．( `プライマリCSV` と呼称)
- `XXXX-setting.json` : `プライマリCSV` をRDFに変換する際に必要なデータを定義( `セッティングJSON` と呼称)．csv2rdfによる変換処理の入力ファイルとなる．
- `XXXX-columns.csv` : `プライマリCSV` のカラムとRDFの語彙を紐付けるCSV( `カラム定義CSV` と呼称)． `セッティングJSON` から参照され、各行のRDF変換を定義する．

### 例

まず，csv2rdfは指定されたJSON( `セッティングJSON` )を見に行きます．

#### セッティングJSON

例えば `セッティングJSON` に `characters-setting.json` を指定した場合について解説します．
その `セッティングJSON` の内容が以下のようなものだとします．

`characters-setting.json`
```json
{
    "subjectBaseUrl": "$BASE_URL/rdfs/characters/",
    "PredicateBaseUrl": "$BASE_URL/prism-schema.ttl#",
    "dataCsvPath": "characters.csv",
    "columnsCsvPath": "characters-columns.csv",
    "rdfType": "$BASE_URL/prism-schema.ttl#Character"
}
```

`セッティングJSON` では下記の項目を指定できます．
それぞれの要素について記述します．いくつかの項目はオプショナルです．この例で不要な項目については後述します．
(例を見ながらのほうがわかりやすいのでざっくり)

- `subjectBaseUrl` : SubjectのURIのベースになるパスです．
- `PredicateBaseUrl` : PredicateのURIのベースになるパスです．
- `dataCsvPath` : `プライマリCSV` のパス
- `columnsCsvPath` : `カラム定義CSV` のパス
- `rdfType`: Subjectのクラス( `rdf:type` )
- `subjectKey` (optional) : (この例では不要) 複数カラムからSubjectのURIのキーを生成するフォーマット (例: 「 `プリパラ1話` の `make_it` 」をキーとする `Live`)
- `relateToMany` (optional) : (この例では不要) 別の `プライマリCSV` から生成されるSubject全てに対してRDFの関係と逆関係を生成する (例: 1シリーズ to nエピソード)

`セッティングJSON` では `プライマリCSV` に `characters.csv` とあります．
その `プライマリCSV` の内容が以下のようなものだとします．

注意点として，一番左のカラムを `key` として，そのカラムでは「スネークケースの英数字」である前提になっています．
これは，`key` をURLで使用するためです．

`characters.csv`
```csv
key,名前,かな,声優
manaka_laala,真中 らぁら,まなか らぁら,茜屋日海夏
minami_mirei,南 みれぃ,みなみ みれぃ,芹澤優
hojo_sophie,北条 そふぃ,ほうじょう そふぃ,久保田未夢
```

#### カラム定義CSV

また `セッティングJSON` では `カラム定義CSV` に `characters-columns.csv` とあります．
その `カラム定義CSV` の内容が以下のようなものだとします．

先程のCSVに `key,名前,かな,声優` というカラムがあるので， `key` を除いた `名前,かな,声優` について，それぞれ紐づく定義を指定します．

`characters-columns.csv`
```csv
key,predicate
名前,name
かな,name_kana
声優,cv
```

と，こんな感じでファイルが用意されている場合に以下のようなttlが生成されます．
また，環境変数は `BASE_URL=https://example.com` としているとします．

`output.ttl`
```
<https://example.com/rdfs/characters/manaka_laala>
    <https://example.com/preds/name> "真中 らぁら";
    <https://example.com/preds/name_kana> "まなか らぁら";
    <https://example.com/preds/cv> "茜屋日海夏".

<https://example.com/rdfs/characters/minami_mirei>
    <https://example.com/preds/name> "南 みれぃ";
    <https://example.com/preds/name_kana> "みなみ みれぃ";
    <https://example.com/preds/cv> "芹澤優".    

<https://example.com/rdfs/characters/hojo_sophie>
    <https://example.com/preds/name> "北条 そふぃ";
    <https://example.com/preds/name_kana> "ほうじょう そふぃ";
    <https://example.com/preds/cv> "久保田未夢".
```

このttlは，例えば

- `https://example.com/rdfs/characters/manaka_laala` の `https://example.com/preds/name` が `"真中 らぁら"`
- `https://example.com/rdfs/characters/manaka_laala` の `https://example.com/preds/name_kana` が `"まなか らぁら"`

みたいな意味です．

カラム定義には下記のキーを指定できます．

- `key`: `プライマリCSV` のどのカラムの値を参照するか
- `predicate`: `key` を参照するときの述語
- `dataType` (optional): `key`を参照した値のデータ型、指定がなければ文字列リテラル (例 `話数` は int としてソートに使いたいので `http://www.w3.org/2001/XMLSchema#integer`)
- `objectUriPrefix` (optional): `key`を参照した値に前置して、リテラルではなくURI参照とする (例 `話数` に対して `$BASE_URL/rdfs/episodes/prichan_` を指定してエピソードURI参照とする)
- `inversePredicate` (optional): `objectUriPrefix` で参照したときに逆参照するときの述語

### 例: セッティングJSONの `subjectKey`

「プリパラの第n話に出てきたsという曲のライブ」について `プライマリCSV` である `pripara-lives.csv` があるとします．
また、RDFでライブという主語を生成するときのURIのキーとして、シリーズ+話数+曲を採用します．

このとき、`プライマリCSV` にある `episode` `song` の2カラムを使ってキーを生成するため、 `セッティングJSON` の `subjectKey` を使いキー生成パターンを定義します．

`"subjectKey": {"keys": ["episode", "song"], "pattern": "pripara_$0_$1"}`

ライブに対して生成されるURIは `$BASE_URL/rdfs/lives/pripara_1_make_it` のようになります．

### 例: セッティングJSONの `relateToMany`

シリーズ一覧 (`プリパラ` `アイドルタイムプリパラ` `キラッとプリ☆チャン` ...) と それぞれのシリーズについてエピソード一覧の `プライマリCSV` があるときに、それらをRDF上で関連づけます．シリーズとエピソードは1対nです．

シリーズの `セッティングJSON` で `relateToMany` をつかって下記のように紐づけを定義します．


```
    "relateToMany": [{
        "predicate": "$BASE_URL/prism-schema.ttl#hasEpisode",
        "inversePredicate": "$BASE_URL/prism-schema.ttl#episodeOfSeries",
        "convertSettingPath": "../_data/convert-settings/$KEY-episodes-setting.json"
    }]
```

* `predicate`: 1側からn側を参照するときの述語
* `inversePredicate`: n側から1側を参照するときの述語
* `convertSettingPath `: n側の `プライマリCSV` の変換に使う `セッティングJSON` ．`$KEY` でシリーズの `key` を参照可能

生成される関係は次のようになります．

1対n側

```
<https://prismdb.takanakahiko.me/rdfs/series/pripara> a <https://prismdb.takanakahiko.me/prism-schema.ttl#Series>;
    <https://prismdb.takanakahiko.me/prism-schema.ttl#hasEpisode> <https://prismdb.takanakahiko.me/rdfs/episodes/pripara_1>, <https://prismdb.takanakahiko.me/rdfs/episodes/pripara_2>, ...
```

逆参照

```
<https://prismdb.takanakahiko.me/rdfs/episodes/pripara_1> <https://prismdb.takanakahiko.me/prism-schema.ttl#episodeOfSeries> <https://prismdb.takanakahiko.me/rdfs/series/pripara>.
:
```
