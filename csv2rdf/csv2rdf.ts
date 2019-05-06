import * as fs from "fs";
import * as path from "path"
import * as csv from "async-csv";
import * as N3 from 'n3'
const { DataFactory } = N3;
const { namedNode, literal, defaultGraph, quad } = DataFactory;

interface Setting {
    subjectBaseUrl: string
    subjectKey: {keys: string[], pattern: string}
    PredicateBaseUrl: string
    dataCsvPath: string
    columnsCsvPath: string
    rdfType: string
    relateToMany: {predicate: string, inversePredicate: string, convertSettingPath: string}[]
}


interface ColumnSetting {
    key: string,
    predicate: string,
    dataType: string,
    objectUriPrefix: string
    inversePredicate: string
}

const addQuad = (store: N3.N3Store, row:Object, columnSetting:ColumnSetting, setting: Setting) => {
    let objectValue = row[columnSetting.key]
    if (row[columnSetting.key].length == 0) return

    const subject = namedNode(setting.subjectBaseUrl + subjectKey(row, setting))
    const predicate = namedNode(setting.PredicateBaseUrl + columnSetting.predicate)
    let object:N3.Quad_Object

    if (columnSetting.objectUriPrefix && columnSetting.objectUriPrefix.length) {
        object = namedNode(replaceBaseurl(columnSetting.objectUriPrefix) + objectValue)
    
        // namedNodeが目的語のときだけ逆参照も可能
        if (columnSetting.inversePredicate && columnSetting.inversePredicate.length) {
            store.addQuad(
                object,
                namedNode(setting.PredicateBaseUrl + columnSetting.inversePredicate),
                subject
            );
        }
    } else if (columnSetting.dataType.length) {
        const dataTypeNode = namedNode(columnSetting.dataType)
        object = literal(objectValue, dataTypeNode)
    } else {
        object = literal(objectValue)
    }

    store.addQuad(subject, predicate, object);

}

const getCsvData = async (filePath: string): Promise<Object[]> => {
    const fullPath = path.join(process.cwd(), filePath)
    const columnsFileData = await fs.readFileSync(fullPath)
    const csvData = await csv.parse(columnsFileData.toString(), { columns: true })
    return csvData as Object[]
}

const getDatas = async (path: string): Promise<object[]> => {
    return await getCsvData(path) as object[]
}

const getColumns = async (path: string): Promise<ColumnSetting[]> => {
    return await getCsvData(path) as ColumnSetting[]
}

const replaceBaseurl = (str:string) => str.replace("$BASE_URL", process.env.BASE_URL)

const getSettings = async (filePath: string): Promise<Setting> => {
    const fullPath = path.join(process.cwd(), filePath)
    const setting =  JSON.parse(fs.readFileSync(fullPath, 'utf8')) as Setting
    setting.subjectBaseUrl = replaceBaseurl(setting.subjectBaseUrl)
    setting.PredicateBaseUrl = replaceBaseurl(setting.PredicateBaseUrl)
    setting.rdfType = replaceBaseurl(setting.rdfType)
    if (setting.relateToMany) {
        setting.relateToMany = setting.relateToMany.map(s => {
            s.predicate = replaceBaseurl(s.predicate)
            s.inversePredicate = replaceBaseurl(s.inversePredicate)
            return s
        })
    }
    return setting
}

const subjectKey = (row: Object, setting: Setting) => {
    if (setting.subjectKey) {
        let s = setting.subjectKey.pattern
        setting.subjectKey.keys.forEach((key, index) => {
            s = s.replace("$" + index, row[key])
        })
        return s
    } else {
        return row["key"]
    }
}

export default class {
    private store

    constructor() {
        this.store = new N3.Store()
    }

    async load(settingPath: string):Promise<void> {
        const setting = await getSettings(settingPath)
        const datas = await getDatas(setting.dataCsvPath)
        const columnSettings = await getColumns(setting.columnsCsvPath)
        for (const row of datas) {
            const key = subjectKey(row, setting)
            if (setting.rdfType) {
                this.store.addQuad(
                    setting.subjectBaseUrl + key,
                    namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
                    namedNode(setting.rdfType)
                );
            }
            columnSettings.forEach(columnSetting => {
                addQuad(this.store, row, columnSetting, setting)
            })
            if (setting.relateToMany) {
                const subject = setting.subjectBaseUrl + key
                for (const s of setting.relateToMany) {
                    const toSetting = await getSettings(s.convertSettingPath.replace("$KEY", key))
                    const toDatas = await getDatas(toSetting.dataCsvPath)
                    toDatas.forEach(toRow => {
                        const object = toSetting.subjectBaseUrl + toRow["key"]
                        this.store.addQuad(
                            namedNode(subject),
                            namedNode(s.predicate),
                            namedNode(object)
                        );
                        this.store.addQuad(
                            namedNode(object),
                            namedNode(s.inversePredicate),
                            namedNode(subject)
                        );
                    })
                }
            }
        }
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
