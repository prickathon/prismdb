import axios from 'axios'

interface Binding{
    [key:string]: {
        type: string
        value: string
    }
}

interface QueryResult{
    head: {
        vars: string[]
    }
    results:{
        bindings: Binding[]
    }
}

export default class {
    static async getKeys(className: string, classBaseUri: string){
        const typePredUri = `http://www.w3.org/1999/02/22-rdf-syntax-ns#type`
        const classUrl = `https://prismdb.takanakahiko.me/prism-schema.ttl#${className}`
        const query = `SELECT ?uri WHERE { ?uri <${typePredUri}> <${classUrl}> }`
        const resp = await this.q(query)
        const keys = resp.results.bindings.map(b => b["uri"].value.replace(classBaseUri, "") )
        return keys
    }
    static async getProperties(key: string, classBaseUri: string){
        const subject = `${classBaseUri}${key}`
        const query = `SELECT ?pred ?obj WHERE { <${subject}> ?pred ?obj }`
        const resp = await this.q(query)
        const ret:object = {}
        resp.results.bindings.forEach(b => {
            const pred = b["pred"].value
            const propertyName = pred.replace("https://prismdb.takanakahiko.me/prism-schema.ttl#", "")
            ret[propertyName] = b["obj"].value
        })
        return ret
    }
    static async q(query: string) {
        const response = await axios.get('http://sparql:8890/sparql', {
            params: { query },
            headers: { 'Content-Type': 'application/sparql-query+json' }
        })
        return response.data as QueryResult
    }
}