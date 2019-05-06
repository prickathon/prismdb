# prismdb-restapi

> prismdbのREST APIを提供するExpressのアプリケーションです

## Environment

- docker
- docker-compose

または

- node(新しめのやつ)
- npm(新しめのやつ)

## Usage

```bash
# ローカルでサーバが立ち上がります(http://localhost/api)
$ docker-compose -f ../docker-compose.dev.yml up
```

または

```bash
# 依存パッケージのインストール
$ npm i

# ローカルでサーバが立ち上がります(http://localhost:4567)
$ npm run start
```

## エンドポイント

/api/character : キャラクターのkey一覧
/api/character/${key} : キャラクターのプロパティ一覧

/api/episode : エピソードのkey一覧
/api/episode/${key} : エピソードのプロパティ一覧

/api/song : 曲のkey一覧
/api/song/${key} : 曲のプロパティ一覧

/api/live : ライブのkey一覧
/api/live/${key} : ライブのプロパティ一覧

/api/series : シリーズのkey一覧
/api/series/${key} : シリーズのプロパティ一覧

メモ : key一覧には以下機能付ける予定です．

- 検索機能(条件に合うキーを取れる．)
- すべて盛り機能(詳細の配列が取得できる．大きめ)