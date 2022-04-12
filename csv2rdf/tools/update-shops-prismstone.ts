import * as fs from "fs";
import * as csv from "async-csv";
import * as cheerio from 'cheerio'
import axios from 'axios'

const fetchShop = async () => {
  const {data} = await axios.get('https://www.takaratomy-arts.co.jp/specials/prettyrhythm/pshj/shoplist.php')
  const $ = cheerio.load(data)
  const ret = $('.info_entry').toArray().map((e, i) => {
    const name = $(e).find('h2 strong').text()
    const fullAddress = $(e).find('.shop_txt p').first().text()

    // 複数行の住所を1行にまとめつつ郵便番号を削る
    const fullAddressLines = fullAddress.split("\n")
    const address = fullAddressLines.map((line) => {
      return line.trim()
    }).join(" ").replace(/〒?[-\d]+/, "").trim()

    const prefecture = getPrefecture(address)

    return {
      series: 'prismstone',
      prefecture,
      name,
      address
    }
  }).filter((shop) => {
    return shop.name.length > 0 && shop.address.length > 0 && shop.prefecture.length > 0;
  })
  return ret
}

// 住所から都道府県を取得する
const getPrefecture = (address: string) => {
  const matched = address.match(/^(.{2,3})(都|道|府|県)/)
  if (matched) {
    return matched[0]
  }
  return ""
}

const addCSV = async () => {
  const shops = await fetchShop()
  shops.sort((a, b) => a.name.localeCompare(b.name, 'ja'))
  const header = ['series', 'prefecture', 'name', 'address']
  const csvData = shops.map(v => header.map(k => v[k].trim()))
  csvData.unshift(header)
  const ret = await csv.stringify(csvData)
  fs.writeFileSync(`../_data/shop/prismstone.csv`, ret);
}

const main = async () => {
  await addCSV()
  console.log(`"../_data/shop/prismstone.csv",`)
}

(async () => {
  await main().catch(e => {
    console.error(e)
    process.exit(1);
  })
})()
