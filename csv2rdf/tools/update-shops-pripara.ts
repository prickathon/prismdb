import * as fs from "fs";
import * as csv from "async-csv";
import * as cheerio from 'cheerio'
import axios from 'axios'

const fetchShop = async (prefName: string) => {
  const { data } = await axios.get(`https://pripara.jp/allidol/shop/list.html?prefectures=${encodeURIComponent(prefName)}`)
  const $ = cheerio.load(data)
  const prefecture = $('h2').text()
  const ret = $('.star_top .inner ul li').toArray().map((e,i) => {
    const name = $(e).find('h3').text()
    const address = $(e).find('p').text()
    return {
      series: 'pripara',
      prefecture,
      name,
      address
    }
  })
  return ret
}

const getPrefNames = async () => {
  const { data } = await axios.get('https://pripara.jp/allidol/shop/')
  const $ = cheerio.load(data)
  return $('.star_top .inner a').toArray().map((e) => {
    return $(e).attr('href').replace('list.html?prefectures=', '')
  })
}

const addCSV = async (prefName: string) => {
  const shops = await fetchShop(prefName)
  const header = ['series', 'prefecture', 'name', 'address']
  const csvData = shops.map(v => header.map(k => v[k].trim() ))
  csvData.unshift(header)
  const ret = await csv.stringify(csvData)
  fs.writeFileSync(`../_data/shop/pripara_${prefName}.csv`, ret);
}

const main = async () => {
  const prefNames = await getPrefNames()
  for(const name of prefNames){
    await addCSV(name)
    console.log(`"../_data/shop/pripara_${name}.csv",`)
  }
}

(async () => {
  await main().catch(e => {
    console.error(e)
    process.exit(1);
  })
})()