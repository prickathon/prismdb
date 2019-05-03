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
- `XXXX-setting.json` : 変換する際に必要なデータを定義( `カラム定義CSV` と呼称)
- `XXXX-colmns.csv` : プライマリデータCSVのカラムとRDFの語彙を紐付けるCSV( `セッティングJSON` と呼称)

### 例

まず，csv2rdfは指定されたJSON( `セッティングJSON` )を見に行きます．

例えば `セッティングJSON` に `characters-setting.json` を指定した場合について解説します．
その `セッティングJSON` の内容が以下のようなものだとします．

`characters-setting.json`
```json
{
    "subjectBaseUrl": "/rdfs/characters/",
    "PredicateBaseUrl": "/preds/",
    "dataCsvPath": "characters.csv",
    "colmnsCsvPath": "characters-colmns.csv"
}
```

それぞれの要素について記述します．
(例を見ながらのほうがわかりやすいのでざっくり)

- `subjectBaseUrl` : ObjectのURIのベースになるパスです．
- `PredicateBaseUrl` : PredicateのURIのベースになるパスです．
- `dataCsvPath` : `プライマリCSV` のパス
- `colmnsCsvPath` : `カラム定義CSV` のパス

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

また `セッティングJSON` では `カラム定義CSV` に `characters-colmns.csv` とあります．
その `カラム定義CSV` の内容が以下のようなものだとします．

先程のCSVに `key,名前,かな,声優` というカラムがあるので， `key` を除いた `名前,かな,声優` について，それぞれ紐づく定義を指定します．

`characters.csv`
```csv
key,prdicate
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
