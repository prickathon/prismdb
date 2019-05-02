import Csv2rdf from './csv2rdf'
import * as fs from 'fs'
import * as rimraf from 'rimraf'

(async () => {
  if(fs.existsSync('./virtuoso')) rimraf.sync('./virtuoso')
  fs.mkdirSync('./virtuoso')
  fs.mkdirSync('./virtuoso/toLoad')

  // const csv2rdf_ = new Csv2rdf()
  // await csv2rdf_.load('./_data/ontology/prism-schema.json')
  // await csv2rdf_.export('./virtuoso/toLoad/output.ttl')

  const csv2rdf = new Csv2rdf()
  await csv2rdf.load('./_data/convert-settings/pripara-characters-setting.json')
  await csv2rdf.export('./virtuoso/toLoad/output.ttl')
})()
