# prismdb

![stat](https://img.shields.io/badge/dynamic/json.svg?label=stat&query=%24.results.bindings%5B%3A1%5D.stat.value&url=https%3A%2F%2Fprismdb.takanakahiko.me%2Fsparql%3Fquery%3DPREFIX%2520rdf%253A%2520%253Chttp%253A%252F%252Fwww.w3.org%252F1999%252F02%252F22-rdf-syntax-ns%2523%253E%250D%250APREFIX%2520prism%253A%2520%253Chttps%253A%252F%252Fprismdb.takanakahiko.me%252Fprism-schema.ttl%2523%253E%250D%250ASELECT%2520%2528group_concat%2528concat%2528%2527%2520%2527%2C%2520str%2528%253Fcnt%2529%2C%2520%2527%2520%2527%2C%2520strafter%2528str%2528%253Fo%2529%2C%2520%2527%2523%2527%2529%2C%2520%2527s%2527%2529%253B%2520separator%253D%2527%2C%2527%2529%2520as%2520%253Fstat%2529%2520WHERE%2520%257B%2520SELECT%2520%253Fo%2520%2528COUNT%2528%253Fs%2529%2520AS%2520%253Fcnt%2529%2520WHERE%2520%257B%2520%253Fs%2520rdf%253Atype%2520%253Fo%2520FILTER%2520%2528%253Fo%2520IN%2520%2528prism%253ACharacter%2C%2520prism%253AEpisode%2C%2520prism%253ASong%2C%2520prism%253ALive%2529%2529%2520%257D%2520GROUP%2520BY%2520%253Fo%2520%257D%250D%250A%26format%3Dapplication%2Fjson&color=ffaad7)

> プリティーシリーズの情報をまとめるプラットフォームです

## Environment

- docker
- docker-compose

## 開発

```bash
# csv(_data/)をrdf(virtuoso/)に変換する処理
$ docker-compose -f docker-compose.csv2rdf.yml up

# ローカルでサーバが立ち上がります(http://localhost)
$ docker-compose -f docker-compose.dev.yml up
```

## 中身

### Webアプリケーション

基本 `Nuxt.js` で動いていますが `https://prismdb.takanakahiko.me/sparqle` のみ `virtuoso` にプロキシされています

- `web/` : nuxtのアプリケーションがあります
- `virtuoso/`(`csv2rdf`により自動生成) : sparqleエンドポイント用のファイルがあります

### csv2rdf

- `_data` : RDFを生成するためのファイルがあります
- `csv2rdf/` : csv(`_data/`)をrdf(`virtuoso/`)に変換する処理があります

### デプロイ

CircleCI -> AWS Code Deploy -> EC2

- `.circleci` : CircleCI の設定があります(code deploy が起動します)
- `.appspec` : code deploy の設定があります( `scripts/start.sh` が起動します)
- `scripts/` : デプロイ時にEC"上で動作する処理が定義されています

## コントリビューション

随時受け付けております！

1. Forkする
2. Cloneする
3. Branchを新しく作る
4. ソースコード等を編集する
5. Pushする
6. Pull Requestを作る
