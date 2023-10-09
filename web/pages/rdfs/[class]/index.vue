<script setup lang="ts">
import { SparqleResponse } from '~/types/SparqleResponse'

const route = useRoute()

const schemeBaseUrl = `https://prismdb.takanakahiko.me/prism-schema.ttl#` // これは環境変数でいいかも
const className = (route.params.class as string).charAt(0).toUpperCase() + (route.params.class as string).slice(1) // 先頭を大文字にする
const classUri = `${schemeBaseUrl}${className}`
const typePredUri = `http://www.w3.org/1999/02/22-rdf-syntax-ns#type`
const query = `SELECT ?URI
WHERE {
  ?URI <${typePredUri}> <${classUri}> .
}`
// ラベル生えたら以下に切り替え
// const query = `SELECT ?Label ?URI
// WHERE {
//   ?URI <${typePredUri}> <${classUri}>;
//        <https://www.w3.org/2000/01/rdf-schema#label> ?Label .
// }`

const { data: response, error } = await useFetch<SparqleResponse>('/sparql', {
  method: 'GET',
  params: { query, format: "json" },
  headers: { 'Content-Type': 'application/sparql-query+json' }
})
if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Data not found' })
}
if (!response.value) {
  throw createError({ statusCode: 404, statusMessage: 'Data not found' })
}
</script>

<template>
  <section class="main-content section">
    <div class="container">
      <nav
        class="breadcrumb"
        aria-label="breadcrumbs"
      >
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/rdfs/">RDFs</a></li>
          <li class="is-active">
            <a :href="`/rdfs/${route.params.class}/`">{{
              route.params.class
            }}</a>
          </li>
        </ul>
      </nav>
      <h1 class="title is-1">
        {{ route.params.class }}
      </h1>
      <div v-if="response">
        <sparql-response-table :response="response" />
      </div>
    </div>
  </section>
</template>
