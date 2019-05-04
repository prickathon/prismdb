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
    columnsCsvPath: string
    rdfType: string
}

const addQuad = (store: N3.N3Store, key, predicate, subject, setting: Setting) => {
    store.addQuad(
        namedNode(setting.subjectBaseUrl + key), //主語
        namedNode(setting.PredicateBaseUrl + predicate), //述語
        literal(subject) //目的語
    );
}

const getCsvData = async (filePath: string): Promise<Object[]> => {
    const fullPath = path.join(process.cwd(), filePath)
    const columnsFileData = await fs.readFileSync(fullPath)
    const csvData = await csv.parse(columnsFileData.toString(), { columns: true })
    return csvData as Object[]
}

const getDatas = async (path: string): Promise<Object[]> => {
    return await getCsvData(path)
}

const getColumns = async (path: string): Promise<{ key: string, prdicate: string }[]> => {
    return await getCsvData(path) as { key: string, prdicate: string }[]
}

const replaceBaseurl = (str:string) => str.replace("$BASE_URL", process.env.BASE_URL)

const getSettings = async (filePath: string): Promise<Setting> => {
    const fullPath = path.join(process.cwd(), filePath)
    const setting =  JSON.parse(fs.readFileSync(fullPath, 'utf8')) as Setting
    setting.subjectBaseUrl = replaceBaseurl(setting.subjectBaseUrl)
    setting.PredicateBaseUrl = replaceBaseurl(setting.PredicateBaseUrl)
    setting.rdfType = replaceBaseurl(setting.rdfType)
    return setting
}

export default class {
    private store

    constructor() {
        this.store = new N3.Store()
    }

    async load(settingPath: string):Promise<void> {
        const setting = await getSettings(settingPath)
        const datas = await getDatas(setting.dataCsvPath)
        const columns = await getColumns(setting.columnsCsvPath)
        datas.forEach(row => {
            if (setting.rdfType) {
                this.store.addQuad(
                    setting.subjectBaseUrl + row["key"],
                    namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
                    namedNode(setting.rdfType)
                );
            }
            columns.forEach(col => {
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
