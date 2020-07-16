# prismdb

![stat](https://img.shields.io/badge/dynamic/json.svg?label=stat&query=%24.results.bindings%5B%3A1%5D.stat.value&url=https%3a%2f%2fprismdb%2etakanakahiko%2eme%2fsparql%3fquery%3dPREFIX%2520rdf%253a%2520%253chttp%253a%252f%252fwww%252ew3%252eorg%252f1999%252f02%252f22%252drdf%252dsyntax%252dns%2523%253e%250d%250aPREFIX%2520prism%253a%2520%253chttps%253a%252f%252fprismdb%252etakanakahiko%252eme%252fprism%252dschema%252ettl%2523%253e%250d%250aSELECT%2520%2528group_concat%2528concat%2528%2527%2520%2527%252c%2520str%2528%253fcnt%2529%252c%2520%2527%2520%2527%252c%2520strafter%2528str%2528%253fo%2529%252c%2520%2527%2523%2527%2529%252c%2520%2527s%2527%2529%253b%2520separator%253d%2527%252c%2527%2529%2520as%2520%253fstat%2529%2520WHERE%2520%257b%2520SELECT%2520%253fo%2520%2528COUNT%2528%253fs%2529%2520AS%2520%253fcnt%2529%2520WHERE%2520%257b%2520%253fs%2520rdf%253atype%2520%253fo%2520FILTER%2520%2528%253fo%2520IN%2520%2528prism%253aCharacter%252c%2520prism%253aEpisode%252c%2520prism%253aSong%252c%2520prism%253aLive%252c%2520prism%253aItem%252c%2520prism%253aShop%252c%2520%2520prism%253aTeam%2529%2529%257d%2520GROUP%2520BY%2520%253fo%2520%257d%26format%3dapplication%2fjson&color=ffaad7)

> プリティーシリーズの情報をまとめるプラットフォームです

## Environment

- docker
- docker-compose

## 開発

```bash
# csv(_data/)をrdf(virtuoso/)に変換する処理
$ docker-compose -f docker-compose.csv2rdf.yml up

# ローカルでサーバが立ち上がります(http://localhost:3000)
$ docker-compose build
$ docker-compose up
```

## 中身

### Webアプリケーション

基本 `Nuxt.js` で動いていますが `https://prismdb.takanakahiko.me/sparqle` のみ `virtuoso` にプロキシされています

- `web/` : nuxtのアプリケーションがあります
- `virtuoso/`(`csv2rdf`により自動生成) : sparqleエンドポイント用のファイルがあります

### csv2rdf

- `_data/` : RDFを生成するためのファイルがあります
- `csv2rdf/` : csv(`_data/`)をrdf(`virtuoso/`)に変換する処理があります

### デプロイ

GitHub Actions -> GCP Cloud Run

- `.github/workflows/` : GitHub Actions の設定があります

## コントリビューション

随時受け付けております！

1. Forkする
2. Cloneする
3. Branchを新しく作る
4. ソースコード等を編集する
5. Pushする
6. Pull Requestを作る
