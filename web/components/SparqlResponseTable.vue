<script setup lang="ts">
import { SparqleResponse } from '~/types/SparqleResponse'
const props = defineProps({
  response: {
    type: Object as PropType<SparqleResponse>,
    required: true
  }
})
</script>

<template>
  <table class="table is-fullwidth">
    <thead>
      <tr>
        <th 
          v-for="colName in props.response.head.vars"
          :key="colName"
        >
          {{ colName }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(binding, i) in props.response.results.bindings"
        :key="i"
      >
        <th
          v-for="(term, key) in binding"
          :key="key"
        >
          <a
            v-if="term.type == 'uri'"
            :href="
              term.value.replace('https://prismdb.takanakahiko.me', '')
            "
          >{{ term.value
            .replace('https://prismdb.takanakahiko.me/prism-schema.ttl#', 'prism:')
            .replace('http://www.w3.org/1999/02/22-rdf-syntax-ns#', 'rdf:')
            .replace('http://www.w3.org/2000/01/rdf-schema#', 'rdfs:')
            .replace('https://prismdb.takanakahiko.me', '')
          }}</a>
          <span v-else>{{ term.value }}</span>
        </th>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
a,
span {
  word-break: break-all;
}
</style>
