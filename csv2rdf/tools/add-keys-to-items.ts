import * as fs from "fs";
import * as path from "path"
import * as csv from "async-csv";

// item_id,rarity,name,category,image_num,color,brand,type,like,outfit_id,series_name,collection_term
// J1-01,HR,しらゆきひめワンピ,ワンピース,71007,青,sweet_honey,ラブリー,2000,J1-02,みらいコレクション,4月4日（木）～5月22日（水）

const getCsvData = async (filePath: string): Promise<string[][]> => {
  const fullPath = path.join(process.cwd(), filePath)
  const columnsFileData = await fs.readFileSync(fullPath)
  const csvData = await csv.parse(columnsFileData.toString())
  return csvData as string[][]
}

const itemId2key = (itemId:string) => {
  return itemId.toLowerCase().replace(/-/g,'_')
}

const convert = async (path:string) => {
  const csvData = await getCsvData(path)
  const header = csvData.shift()  //ヘッダを削除
  const converted = csvData.map(row => {
    const item_id = itemId2key(row[0])
    const newRow = [item_id, ...row]
    return newRow
  })
  const newHeader = [ 'key', ...header]
  converted.unshift(newHeader)
  const ret = await csv.stringify(converted)
  fs.writeFileSync(path, ret);
  console.log(ret)
}

(async () => {
  // await convert('../_data/prichan-items-BR.csv')
  // await convert('../_data/prichan-items-J1.csv')
  // await convert('../_data/prichan-items-J2.csv')
  // await convert('../_data/prichan-items-PB.csv')
  await convert('../_data/prichan-items-PCH6.csv')
})()
