import * as fs from "fs";
import * as path from "path"
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
      prefecture,
      name,
      address
    }
  })
  return ret
}

const gegtPrefNames = async () => {
  const { data } = await axios.get('https://prichan.jp/shop/')
  const $ = cheerio.load(data)
  return $('.shopLink a').toArray().map((e) => {
    return $(e).attr('href').replace('.html', '')
  })
}

const addCSV = async (prefName: string) => {
  const shops = await fetchShop(prefName)
  const header = ['prefecture', 'name', 'address']
  const csvData = shops.map(v => header.map(k => v[k]))
  csvData.unshift(header)
  const ret = await csv.stringify(csvData)
  fs.writeFileSync(`../_data/shop/${prefName}.csv`, ret);
}

(async () => {
  const prefNames = [
    'hokkaido',
    'aomori',
    'iwate',
    'miyagi',
    'akita',
    'yamagata',
    'fukushima',
    'ibaraki',
    'tochigi',
    'gunma',
    'saitama',
    'chiba',
    'tokyo',
    'kanagawa',
    'niigata',
    'toyama',
    'ishikawa',
    'fukui',
    'yamanashi',
    'nagano',
    'gifu',
    'shizuoka',
    'aichi',
    'mie',
    'shiga',
    'kyoto',
    'osaka',
    'hyogo',
    'nara',
    'wakayama',
    'tottori',
    'shimane',
    'okayama',
    'hiroshima',
    'yamaguchi',
    'tokushima',
    'kagawa',
    'ehime',
    'kochi',
    'fukuoka',
    'saga',
    'nagasaki',
    'kumamoto',
    'oita',
    'miyazaki',
    'kagoshima',
    'okinawa'
  ]
  for(const name of prefNames){
    addCSV(name)
    console.log(`"../_data/shop/${name}.csv",`)
  }
  // const ret = await gegtPrefNames()
  // console.log(ret)
})()