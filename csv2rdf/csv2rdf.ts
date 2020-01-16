import * as fs from "fs";
import * as path from "path"
import * as csv from "async-csv";
import * as N3 from 'n3'
const { DataFactory } = N3;
const { namedNode, literal, defaultGraph, quad } = DataFactory;

interface KeyAndPattern {
    keys: string[],
    pattern: string
}

interface Setting {
    subjectBaseUrl: string
    subjectKey: KeyAndPattern
    PredicateBaseUrl: string
    dataCsvPath: string | string[]
    columnsCsvPath: string
    rdfType: string
    relateToMany: {predicate: string, inversePredicate: string, convertSettingPath: string}[]
    label: KeyAndPattern
}


interface ColumnSetting {
    key: string,
    predicate: string,
    dataType?: string,
    objectUriPrefix?: string
    inversePredicate?: string
    objectsSeparator?: string
}

const addQuad = (store: N3.N3Store, row:Object, columnSetting:ColumnSetting, setting: Setting) => {
    const cell = row[columnSetting.key]
    const separator = columnSetting.objectsSeparator
    const objectValues = (separator ? cell.split(separator) : [cell]).filter(v => v).map(v => v.trim())

    for (let objectValue of objectValues) {
        const subject = namedNode(setting.subjectBaseUrl + subjectKey(row, setting))
        const predicate = namedNode(setting.PredicateBaseUrl + columnSetting.predicate)
        let object:N3.Quad_Object
        if (columnSetting.objectUriPrefix) {
            object = namedNode(replaceBaseurl(columnSetting.objectUriPrefix) + objectValue)
        
            // namedNodeが目的語のときだけ逆参照も可能
            if (columnSetting.inversePredicate) {
                store.addQuad(
                    object,
                    namedNode(setting.PredicateBaseUrl + columnSetting.inversePredicate),
                    subject
                );
            }
        } else if (columnSetting.dataType) {
            const dataTypeNode = namedNode(columnSetting.dataType)
            object = literal(objectValue, dataTypeNode)
        } else {
            object = literal(objectValue)
        }

        store.addQuad(subject, predicate, object);
    }
}

const getCsvData = async (filePath: string): Promise<Object[]> => {
    const fullPath = path.join(process.cwd(), filePath)
    const columnsFileData = await fs.readFileSync(fullPath)
    const csvData = await csv.parse(columnsFileData.toString(), { columns: true })
    return csvData as Object[]
}

const getDatas = async (path: string | string[]): Promise<object[]> => {
    if(typeof path === "string") path = [path]
    let ret:object[] = []
    for(let p of path){
        console.log(`    converting ${p} ...`)
        ret = ret.concat(await getCsvData(p))
    }
    return ret
}

const getColumns = async (path: string): Promise<ColumnSetting[]> => {
    const columnSettings = await getCsvData(path) as ColumnSetting[]
    return columnSettings.map(columnSetting => {
        Object.keys(columnSetting).forEach(key => {
            if(!columnSetting[key].length) delete columnSetting[key]
        })
        return columnSetting
    })
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



const getPatternResult = (keyAndPattern:KeyAndPattern, row: Object) => {
    let s = keyAndPattern.pattern
    keyAndPattern.keys.forEach((key, index) => {
        s = s.replace("$" + index, row[key])
    })
    return s
}

const subjectKey = (row: Object, setting: Setting) => {
    const val = setting.subjectKey ? getPatternResult(setting.subjectKey, row) : row["key"] as string
    return val.normalize("NFKC").replace(/ /g,"").replace(/　/g,"")
}

const getLebel = (row: Object, setting: Setting) => {
    return getPatternResult(setting.label, row)
}

export default class {
    private store

    constructor() {
        this.store = new N3.Store()
    }

    async load(settingPath: string):Promise<void> {
        console.log(`loading ${settingPath} ...`)
        const setting = await getSettings(settingPath)
        const datas = await getDatas(setting.dataCsvPath)
        const columnSettings = await getColumns(setting.columnsCsvPath)
        for (const row of datas) {
            const key = subjectKey(row, setting)
            const subjectNode = namedNode(setting.subjectBaseUrl + key)
            if (setting.rdfType) {
                this.store.addQuad(
                    subjectNode,
                    namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
                    namedNode(setting.rdfType)
                );
            }
            if (setting.label) {
                this.store.addQuad(
                    subjectNode,
                    namedNode("http://www.w3.org/2000/01/rdf-schema#label"),
                    literal(getLebel(row, setting))
                );
            }
            columnSettings.forEach(columnSetting => {
                addQuad(this.store, row, columnSetting, setting)
            })
            if (setting.relateToMany) {
                for (const s of setting.relateToMany) {
                    const toSetting = await getSettings(s.convertSettingPath.replace("$KEY", key))
                    const toDatas = await getDatas(toSetting.dataCsvPath)
                    const predicateNode = namedNode(s.predicate)
                    const inversePredicateNode = namedNode(s.inversePredicate)
                    toDatas.forEach(toRow => {
                        const object = toSetting.subjectBaseUrl + toRow["key"]
                        const objectNode = namedNode(object)
                        this.store.addQuad(subjectNode, predicateNode, objectNode)
                        this.store.addQuad(objectNode, inversePredicateNode, subjectNode)
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
