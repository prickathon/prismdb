import Csv2rdf from './csv2rdf'
import * as fs from 'fs'
import * as rimraf from 'rimraf'

(async () => {
  // virtuosoディレクトリを削除し，virtuoso/toLoadディレクトリを作成
  if(fs.existsSync('../virtuoso')) rimraf.sync('../virtuoso')
  fs.mkdirSync('../virtuoso')
  fs.mkdirSync('../virtuoso/toLoad')

  // schema.ttl を作成
  // const csv2rdf_ = new Csv2rdf()
  // await csv2rdf_.load('./_data/ontology/prism-schema.json')
  // await csv2rdf_.export('./virtuoso/toLoad/schema.ttl')

  // output.ttl(virtuosoにロードするデータ)を作成
  const csv2rdf = new Csv2rdf()
  await csv2rdf.load('../_data/convert-settings/pripara-characters-setting.json')
  await csv2rdf.export('../virtuoso/toLoad/output.ttl')
})()
