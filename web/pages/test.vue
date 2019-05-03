<template>
  <div>
    <p>{{ ret }}</p>
    <b-table :data="events">
      <template slot-scope="props">
        <b-table-column label="ID">{{ props.row.id }}</b-table-column>
        <b-table-column label="Title">{{
          props.row.details.title
        }}</b-table-column>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  async asyncData({ $axios }) {
    const query = `
    SELECT ?s ?h
    WHERE {
      ?s <http://localhost:8890/name> ?h
    }
    `
    const ret = await $axios.$get('/sparql', {
      params: { query },
      headers: { 'Content-Type': 'application/sparql-query' }
    })
    return { results: ret.results.bindings }
  }
}
</script>
