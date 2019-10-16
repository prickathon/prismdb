import * as fs from "fs";
import * as csv from "async-csv";
import * as cheerio from 'cheerio'
import axios from 'axios'

const fetchShop = async (prefName: string) => {
  const { data } = await axios.get(`https://prichan.jp/shop/${prefName}.html`)
  const $ = cheerio.load(data)
  const prefecture = $('.titleLv2').text()
  const ret = $('.shopList li').toArray().map((e,i) => {
    const name = $(e).find('dt').text()
    const address = $(e).find('dd').text()
    return {
      series: 'prichan',
      prefecture,
      name,
      address
    }
  })
  return ret
}

const getPrefNames = async () => {
  const { data } = await axios.get('https://prichan.jp/shop/')
  const $ = cheerio.load(data)
  return $('.shopLink a').toArray().map((e) => {
    return $(e).attr('href').replace('.html', '')
  })
}

const addCSV = async (prefName: string) => {
  const shops = await fetchShop(prefName)
  const header = ['series', 'prefecture', 'name', 'address']
  const csvData = shops.map(v => header.map(k => v[k].trim() ))
  csvData.unshift(header)
  const ret = await csv.stringify(csvData)
  fs.writeFileSync(`../_data/shop/prichan_${prefName}.csv`, ret);
}

const main = async () => {
  const prefNames = await getPrefNames()
  for(const name of prefNames){
    await addCSV(name)
    console.log(`"../_data/shop/prichan_${name}.csv",`)
  }
}

(async () => {
  await main().catch(e => {
    console.error(e)
    process.exit(1);
  })
})()