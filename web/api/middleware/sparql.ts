import axios from 'axios'
import { KeyValue } from './util'

interface Binding {
    [key: string]: {
        datatype: string
        value: string
    }
}

interface QueryResult {
    head: {
        vars: string[]
    }
    results: {
        bindings: Binding[]
    }
}

const schemaUri = `https://prismdb.takanakahiko.me/prism-schema.ttl#`
const typePredUri = `http://www.w3.org/1999/02/22-rdf-syntax-ns#type`
const uri2schema = (uri:string) => uri.replace(/https:\/\/prismdb\.takanakahiko\.me\/prism-schema\.ttl#.+?/, "")
const schema2uri = (schema:string) => `${schemaUri}${schema}`
const uri2key = (uri:string) => uri.replace(/https:\/\/prismdb\.takanakahiko\.me\/rdfs\/.+?\//, "")
const classBaseUri = (className:string) => `https://prismdb.takanakahiko.me/rdfs/${className.toLowerCase()}/`

const bindings2object = (
    bindings: Binding[],
    arrayParameters: { [_: string]: string } = {}
) => {
    const ret: KeyValue = {}
    Object.keys(arrayParameters).forEach(predicateName => {
        const parameterName = arrayParameters[predicateName]
        ret[parameterName] = []
    })
    bindings.forEach(b => {
        const pred = b["pred"].value
        if (!pred.includes(schemaUri)) return
        const predicateName = pred.replace(schemaUri, "")
        let value = uri2key(b["obj"].value) as any
        switch (b["obj"].datatype) {
            case "http://www.w3.org/2001/XMLSchema#integer":
                value = parseInt(value)
                break
        }
        if (arrayParameters && (predicateName in arrayParameters)) {
            const parameterName = arrayParameters[predicateName]
            ret[parameterName].push(value)
        } else {
            ret[predicateName] = value
        }
    })
    return ret
}

export default class {
    static async getKeys(className: string) {
        const query = `SELECT ?sub WHERE { ?sub <${typePredUri}> <${schema2uri(className)}> }`
        const resp = await this.q(query)
        const subjectUris = resp.results.bindings.map(b => b["sub"].value)
        const ret = subjectUris.map(uri2key)
        return ret
    }
    static async getInstanceList(className: string, arrayParameters?: { [_: string]: string }) {
        const classUrl = schema2uri(className)
        const query = `SELECT ?sub ?pred ?obj WHERE { ?sub <${typePredUri}> <${classUrl}>; ?pred ?obj. }`
        const resp = await this.q(query)
        const subjectUris = resp.results.bindings.map(b => b["sub"].value)
        const uniqueSubjectUris = subjectUris.filter((x, i, self) => self.indexOf(x) === i)
        return uniqueSubjectUris.map(subjectUri => {
            const targetBindings = resp.results.bindings.filter(b => b["sub"].value == subjectUri)
            const instance = bindings2object(targetBindings, arrayParameters)
            instance["_key"] = uri2key(subjectUri)
            return instance
        });
    }
    static async getInstance(className: string, key: string, arrayParameters?: { [_: string]: string }) {
        const subject = `${classBaseUri(className)}${key}`
        const query = `SELECT ?pred ?obj WHERE { <${subject}> ?pred ?obj }`
        const resp = await this.q(query)
        return bindings2object(resp.results.bindings, arrayParameters)
    }
    static async q(query: string) {
        const response = await axios.get(process.env.SPARQL_ENDPOINT_URL!, {
            params: { query },
            headers: { 'Content-Type': 'application/sparql-query+json' }
        })
        return response.data as QueryResult
    }
}