import * as N3 from 'n3'
import type { SparqleResponse } from '~/types/SparqleResponse'

export default defineEventHandler(async () => {
  const query = `SELECT ?s ?p ?o WHERE {
    VALUES ?type {
      <http://www.w3.org/2000/01/rdf-schema#Class>
      <http://www.w3.org/1999/02/22-rdf-syntax-ns#Property>
    }
    ?s a ?type .
    ?s ?p ?o .
    FILTER(STRSTARTS(STR(?s), "https://prismdb.takanakahiko.me/"))
  } ORDER BY DESC(?type) ?s ?p`
  const response = await fetch(`${process.env.SPARQL_ENDPOINT_URL!}?query=${encodeURIComponent(query)}&format=json`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/sparql-query+json' },
  })
  const json = await response.json() as SparqleResponse

  const writer = new N3.Writer()
  for (const binding of json.results.bindings) {
    const subject = N3.DataFactory.namedNode(binding.s.value)
    const predicate = N3.DataFactory.namedNode(binding.p.value)
    const o = binding.o
    const object = o.type === 'uri'
      ? N3.DataFactory.namedNode(o.value)
      : N3.DataFactory.literal(o.value, 'datatype' in o ? N3.DataFactory.namedNode(o.datatype) : undefined)
    writer.addQuad(subject, predicate, object)
  }

  const turtle = await new Promise<string>((resolve, reject) => {
    writer.end((error, result) => {
      if (error) reject(error)
      else resolve(result)
    })
  })

  return new Response(turtle, {
    headers: { 'Content-Type': 'text/turtle; charset=utf-8' },
  })
})
