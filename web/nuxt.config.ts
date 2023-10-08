import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  routeRules: {
    '/sparql': { proxy: process.env.SPARQL_ENDPOINT_URL },
  },
  typescript: {
    typeCheck: true,
  },
})
