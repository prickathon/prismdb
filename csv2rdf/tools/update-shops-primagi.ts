import * as fs from "fs";
import * as csv from "async-csv";
import * as cheerio from 'cheerio'
import * as https from 'https'
import axios from 'axios'

const fetchShop = async (prefId: string, prefName: string) => {
  const { data } = await axios.get(`https://cdnprimagiimg01.blob.core.windows.net/primagi/data/json/shop/${prefId}.json`)
  const ret = Object.values(data).map((value) => {
    // NOTE: 現在はAddressに都道府県がついていないが、公式の気まぐれで勝手に付く可能性があるので都道府県が含まれてない場合のみ付与する
    const address = value["Address"].startsWith(prefName) ? value["Address"] : prefName + value["Address"]

    return {
      series: 'primagi',
      prefecture: prefName,
      name: value["Name"],
      latitude: value["Latitude"],
      longitude: value["Longitude"],
      group: value["ShopGroup"],
      address: address,
    }
  }).filter((shop) => {
    return shop.name.length > 0 && shop.address.length > 0;
  })
  return ret
}

const getPrefs = async () => {
  const httpsAgent = new https.Agent({ rejectUnauthorized: false })
  const { data } = await axios.get('https://primagi.jp/shop/', { httpsAgent })
  const $ = cheerio.load(data)
  return $('.prefectures .prefectures_item a').toArray().map((e) => {
    return {
      id: $(e).attr('data-pref-id'),
      name: $(e).text(),
    }
  })
}

const addCSV = async (prefId: string, prefName: string) => {
  const shops = await fetchShop(prefId, prefName)
  shops.sort((a, b) => a.name.localeCompare(b.name, 'ja'))
  const header = ['series', 'prefecture', 'name', 'address', 'latitude', 'longitude', 'group']
  const csvData = shops.map(v => header.map(k => v[k].trim() ))
  csvData.unshift(header)
  const ret = await csv.stringify(csvData)
  fs.writeFileSync(`../_data/shop/primagi_${prefName}.csv`, ret);
}

const main = async () => {
  const prefs = await getPrefs()
  for(const pref of prefs){
    await addCSV(pref.id, pref.name)
    console.log(`"../_data/shop/primagi_${pref.name}.csv",`)
  }
}

(async () => {
  await main().catch(e => {
    console.error(e)
    process.exit(1);
  })
})()
