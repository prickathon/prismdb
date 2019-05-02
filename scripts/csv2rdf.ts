import * as fs from "fs";
import * as path from "path"
import * as csv from "async-csv";
import * as N3 from 'n3'
const { DataFactory } = N3;
const { namedNode, literal, defaultGraph, quad } = DataFactory;

interface Setting {
    subjectBaseUrl: string
    PredicateBaseUrl: string
    dataCsvPath: string
    colmnsCsvPath: string
}

const addQuad = (store: N3.N3Store, key, predicate, subject, setting: Setting) => {
    store.addQuad(
        namedNode(process.env.BASE_URL + setting.subjectBaseUrl + key), //主語
        namedNode(process.env.BASE_URL + setting.PredicateBaseUrl + predicate), //述語
        literal(subject) //目的語
    );
}

const getCsvData = async (filePath: string): Promise<Object[]> => {
    const fullPath = path.join(process.cwd(), filePath)
    const colmnsFileData = await fs.readFileSync(fullPath)
    const csvData = await csv.parse(colmnsFileData.toString(), { columns: true })
    return csvData as Object[]
}

const getDatas = async (path: string): Promise<Object[]> => {
    return await getCsvData(path)
}

const getColomns = async (path: string): Promise<{ key: string, prdicate: string }[]> => {
    return await getCsvData(path) as { key: string, prdicate: string }[]
}

const getSettings = async (filePath: string): Promise<Setting> => {
    const fullPath = path.join(process.cwd(), filePath)
    return JSON.parse(fs.readFileSync(fullPath, 'utf8')) as Setting
}

export default class {
    private store

    constructor() {
        this.store = new N3.Store()
    }

    async load(settingPath: string):Promise<void> {
        const setting = await getSettings(settingPath)
        const datas = await getDatas(setting.dataCsvPath)
        const colmns = await getColomns(setting.colmnsCsvPath)
        datas.forEach(row => {
            colmns.forEach(col => {
                if (row[col.key].length > 0) addQuad(this.store, row["key"], col.prdicate, row[col.key], setting)
            })
        })
    }

    async export(path: string):Promise<void> {
        return new Promise((resolve, reject) => {
            const writer = new N3.Writer()
            writer.addQuads(this.store.getQuads(null, null, null, null))
            writer.end((error, result) => {
                if(error) reject()
                fs.writeFileSync(path, result)
                resolve()
            })
        })
    }
}
