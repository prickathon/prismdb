<template>
  <section class="main-content section">
    <div class="container">
      <nav class="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/rdfs/">RDFs</a></li>
          <li>
            <a :href="`/rdfs/${className}/`">{{ className }}</a>
          </li>
          <li class="is-active">
            <a href="#">{{ key }}</a>
          </li>
        </ul>
      </nav>
      <h1 class="title is-1">
        {{ label }}
      </h1>
      <sparql-response-table :response="response" />
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import SparqlResponseTable from '~/components/SparqlResponseTable.vue'

interface RdfTerms1 {
  type: 'uri'
  value: string
}

interface RdfTerms2 {
  type: 'literal'
  value: string
}

interface RdfTerms3 {
  type: 'literal'
  value: string
  'xml:lang': string
}

interface RdfTerms4 {
  type: 'literal'
  value: string
  datatype: string
}

interface RdfTerms5 {
  type: 'bnode'
  value: string
}

interface SparqleResponse {
  head: {
    vars: string[]
    link: string[]
  }
  results: {
    bindings: {
      [key: string]: RdfTerms1 | RdfTerms2 | RdfTerms3 | RdfTerms4 | RdfTerms5
    }[]
  }
}

export default Vue.extend({
  components: { SparqlResponseTable },
  computed: {
    label (): string {
      let ret = ''
      this.response.results.bindings.forEach((binding) => {
        const labelUri = 'http://www.w3.org/2000/01/rdf-schema#label'
        if (binding.Property.value === labelUri) { ret = binding.Value.value }
      })
      return ret
    }
  },
  async asyncData ({ $axios, params, error }) {
    const rdfsBaseUrl = `https://prismdb.takanakahiko.me/rdfs/` // これは環境変数でいいかも
    const subjectUrl = `${rdfsBaseUrl}${params.class}/${params.key}`
    const query = `SELECT ?Property ?Value WHERE { <${subjectUrl}> ?Property ?Value }`
    try {
      const response = await $axios.get<SparqleResponse>('/sparql', {
        params: { query },
        headers: { 'Content-Type': 'application/sparql-query+json' }
      })
      if (response.data.results.bindings.length) {
        return {
          response: response.data,
          key: params.key,
          className: params.class
        }
      } else {
        error({ statusCode: 404, message: 'Data not found' })
      }
    } catch (e) {
      error({ statusCode: 404, message: 'Data not found' })
    }
  }
})
</script>
