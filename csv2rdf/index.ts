import Csv2rdf from './csv2rdf'
import * as fs from 'fs'
import * as rimraf from 'rimraf'

(async () => {
  // virtuosoディレクトリを削除し，virtuoso/toLoadディレクトリを作成
  if(fs.existsSync('../virtuoso')) rimraf.sync('../virtuoso')
  fs.mkdirSync('../virtuoso')
  fs.mkdirSync('../virtuoso/toLoad')

  // schema.ttl を作成
  const schema = new Csv2rdf()
  await schema.load('../_data/schema/classes-setting.json')
  await schema.export('../virtuoso/toLoad/prism-schema.ttl')

  // webでホストする schema.ttl も更新
  if(fs.existsSync('../web/static/prism-schema.ttl')) fs.unlinkSync('../web/static/prism-schema.ttl')
  await schema.export('../web/static/prism-schema.ttl')

  // output.ttl(virtuosoにロードするデータ)を作成
  const csv2rdf = new Csv2rdf()
  await csv2rdf.load('../_data/convert-settings/pripara-characters-setting.json')
  await csv2rdf.load('../_data/convert-settings/pripara-episodes-setting.json')
  await csv2rdf.load('../_data/convert-settings/ipp-episodes-setting.json')
  await csv2rdf.load('../_data/convert-settings/prichan-episodes-setting.json')
  await csv2rdf.load('../_data/convert-settings/series-setting.json')
  await csv2rdf.load('../_data/convert-settings/songs-setting.json')
  await csv2rdf.load('../_data/convert-settings/pripara-lives-setting.json')
  await csv2rdf.load('../_data/convert-settings/prichan-lives-setting.json')
  await csv2rdf.export('../virtuoso/toLoad/output.ttl')
})()
