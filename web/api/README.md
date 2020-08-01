# prismdb-restapi

> prismdb の REST API を提供するExpressのアプリケーションです

## Usage 

1階層上の nuxt のアプリケーションの起動時に /api で起動します。

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

## 仕様

エンドポイントは 

- /api/${クラス名}
- /api/${クラス名}/${キー名}

の２種類が存在します

### /api/${クラス名}

そのクラスのインスタンス一覧を返します．

- クエリストリングのkey-valueを指定した場合，それと一致するプロパティを持つインスタンスのみ返します
- クエリストリングを設定しない場合，すべての結果が返ります

例えば

`/api/episode?話数=1` をリクエストした場合

```json
{
  "results": [
    {
      "lives": [],
      "episodeOfSeries": "ipp",
      "アニメーション演出": "Nam Sung Min",
      "サブタイトル": "ゆめかわアイドル始めちゃいました！？",
      "ストーリーボード": "Nam Sung Min、An Jai Ho",
      "作画監修": "斉藤里枝、川島尚",
      "放送日(TXN)": "2017年4月4日",
      "演出": "佐藤まさふみ",
      "絵コンテ": "誌村宏明",
      "脚本": "加藤還一",
      "話数": 1,
      "_key": "ipp_1",
    },
    {
      "lives": [
        "prichan_1_ready_action"
      ],
      "episodeOfSeries": "prichan",
      "あにてれ": "https://ch.ani.tv/episodes/13143",
      "サブタイトル": "キラッとプリ☆チャンやってみた！",
      "話数": 1,
      "_key": "prichan_1"
    },
    {
      "lives": [],
      "episodeOfSeries": "pripara",
      "アニメーション演出": "Na Ki Chual、Choi Hun Cheol",
      "サブタイトル": "アイドル始めちゃいました！",
      "ストーリーボード": "Sung Won Yong",
      "作画監修": "斉藤里枝、本多恵美、森友宏樹",
      "放送日(TXN)": "2014/7/5",
      "演出": "徳本善信",
      "絵コンテ": "森脇真琴",
      "脚本": "土屋理敬",
      "話数": 1,
      "_key": "pripara_1"
    }
  ]
}
```

のように，話数が `1` のepisodeのみ取得できます．

### /api/${クラス名}/${キー名}

そのそのクラス，キーに応じたインスタンスを返します．

- すべてのクエリストリングはクエリストリングは無効です

例えば

`/api/episode/pripara_1` をリクエストした場合

```
{
  "lives": [],
  "episodeOfSeries": "ipp",
  "アニメーション演出": "Nam Sung Min",
  "サブタイトル": "ゆめかわアイドル始めちゃいました！？",
  "ストーリーボード": "Nam Sung Min、An Jai Ho",
  "作画監修": "斉藤里枝、川島尚",
  "放送日(TXN)": "2017年4月4日",
  "演出": "佐藤まさふみ",
  "絵コンテ": "誌村宏明",
  "脚本": "加藤還一",
  "話数": 1
}
```

のように，キーが `pripara_1` のepisodeを取得できます．
