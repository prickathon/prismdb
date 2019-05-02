import Csv2rdf from './csv2rdf'
import * as fs from 'fs'

(async () => {
  const csv2rdf = new Csv2rdf()
  await csv2rdf.load('./_data/convert-settings/pripara-characters-setting.json')
  if (!fs.existsSync('./virtuoso/toLoad')) fs.mkdirSync('./virtuoso/toLoad')
  await csv2rdf.export('./virtuoso/toLoad/output.ttl')
})()
