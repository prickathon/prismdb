import Csv2rdf from './csv2rdf'
import * as fs from 'fs'
import * as rimraf from 'rimraf'

const main = async () => {
  // virtuosoディレクトリを削除し，virtuoso/toLoadディレクトリを作成
  if(fs.existsSync('../virtuoso/data')) rimraf.sync('../virtuoso/data')
  fs.mkdirSync('../virtuoso/data')
  fs.mkdirSync('../virtuoso/data/toLoad')

  // schema.ttl を作成
  const schema = new Csv2rdf()
  await schema.load('../_data/schema/classes-setting.json')
  await schema.load('../_data/schema/properties-setting.json')
  await schema.export('../virtuoso/data/toLoad/prism-schema.ttl')

  // webでホストする schema.ttl も更新
  if(fs.existsSync('../web/static/prism-schema.ttl')) fs.unlinkSync('../web/static/prism-schema.ttl')
  await schema.export('../web/static/prism-schema.ttl')

  // output.ttl(virtuosoにロードするデータ)を作成
  const csv2rdf = new Csv2rdf()
  await csv2rdf.load('../_data/character/pripara-characters-setting.json')
  await csv2rdf.load('../_data/character/prichan-characters-setting.json')
  await csv2rdf.load('../_data/episode/pripara-episodes-setting.json')
  await csv2rdf.load('../_data/episode/ipp-episodes-setting.json')
  await csv2rdf.load('../_data/episode/prichan-episodes-setting.json')
  await csv2rdf.load('../_data/episode/ad-episodes-setting.json')
  await csv2rdf.load('../_data/episode/dmf-episodes-setting.json')
  await csv2rdf.load('../_data/episode/rl-episodes-setting.json')
  await csv2rdf.load('../_data/series/series-setting.json')
  await csv2rdf.load('../_data/song/songs-setting.json')
  await csv2rdf.load('../_data/live/pripara-lives-setting.json')
  await csv2rdf.load('../_data/live/prichan-lives-setting.json')
  await csv2rdf.load('../_data/live/prr-lives-setting.json')
  await csv2rdf.load('../_data/item/prichan-items-setting.json')
  await csv2rdf.load('../_data/shop/prichan-shop-setting.json')
  await csv2rdf.load('../_data/shop/pripara-shop-setting.json')
  await csv2rdf.load('../_data/team/pripara-teams-setting.json')
  await csv2rdf.load('../_data/team/prichan-teams-setting.json')
  await csv2rdf.load('../_data/brand/brands-setting.json')
  await csv2rdf.export('../virtuoso/data/toLoad/output.ttl')
}

(async () => {
  await main().catch(e => {
    console.error(e)
    process.exit(1);
  })
})()
