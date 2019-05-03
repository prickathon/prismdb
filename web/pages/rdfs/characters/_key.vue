<template>
  <div>
    <nav class="breadcrumb" aria-label="breadcrumbs">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/rdfs/">RDFs</a></li>
        <li><a href="/rdfs/characters/">Character</a></li>
        <li class="is-active">
          <a href="#">{{ name }}</a>
        </li>
      </ul>
    </nav>
    <h1 class="title is-1">{{ name }}</h1>
    <b-table :data="results">
      <template slot-scope="props">
        <b-table-column label="Property">{{
          props.row.s.value
        }}</b-table-column>
        <b-table-column label="Value">{{ props.row.h.value }}</b-table-column>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  async asyncData({ $axios, params, error }) {
    const query = `SELECT ?s ?h
    WHERE {
      <http://localhost/rdfs/characters/${params.key}> ?s ?h
    }`
    try {
      const ret = await $axios.$get('/sparql', {
        params: { query },
        headers: { 'Content-Type': 'application/sparql-query+json' }
      })
      return {
        results: ret.results.bindings,
        name: params.key
      }
    } catch (e) {
      error({ statusCode: 404, message: 'Data not found' })
    }
  }
}
</script>
