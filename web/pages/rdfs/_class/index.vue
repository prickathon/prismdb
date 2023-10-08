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
            <a :href="`/rdfs/${$route.params.class}/`">{{
              $route.params.class
            }}</a>
          </li>
        </ul>
      </nav>
      <h1 class="title is-1">
        {{ $route.params.class }}
      </h1>
      <sparql-response-table :response="response" />
    </div>
  </section>
</template>

<script lang="ts">
definePageMeta({
  async asyncData ({ params, error }) {
    const schemeBaseUrl = `https://prismdb.takanakahiko.me/prism-schema.ttl#` // これは環境変数でいいかも
    const className =
      params.class.charAt(0).toUpperCase() + params.class.slice(1) // 先頭を大文字にする
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
    try {
      const response = await fetch(`/sparql?query=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/sparql-query+json' }
      });
      const data = await response.json();
      if (data.results.bindings.length) {
        return { response, className }
      } else {
        error({ statusCode: 404, message: 'Data not found' + query })
      }
    } catch (e) {
      error({ statusCode: 404, message: 'Data not found' })
    }
  }
})
</script>
