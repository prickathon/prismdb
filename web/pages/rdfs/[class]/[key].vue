<script setup lang="ts">
import { SparqleResponse } from '~/types/SparqleResponse'

const route = useRoute()

// from asyncData
const rdfsBaseUrl = `https://prismdb.takanakahiko.me/rdfs/` // これは環境変数でいいかも
const subjectUrl = `${rdfsBaseUrl}${route.params.class}/${route.params.key}`
const query = `SELECT ?Property ?Value WHERE { <${subjectUrl}> ?Property ?Value }`

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

const label = computed(() => {
  let ret = ''
  response.value?.results.bindings.forEach((binding) => {
    const labelUri = 'http://www.w3.org/2000/01/rdf-schema#label'
    if (binding.Property.value === labelUri) { ret = binding.Value.value }
  })
  return ret
})

useSeoMeta({
  title: () => `${label.value} - PrismDB`,
  description: () => `prismdb の「${label.value}」のページです`,
})
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
          <li>
            <a :href="`/rdfs/${route.params.class}/`">{{ route.params.class }}</a>
          </li>
          <li class="is-active">
            <a href="#">{{ route.params.key }}</a>
          </li>
        </ul>
      </nav>
      <h1 class="title is-1">
        {{ label }}
      </h1>
      <div v-if="response">
        <sparql-response-table :response="response" />
      </div>
    </div>
  </section>
</template>
