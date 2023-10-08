import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  routeRules: {
    '/sparql': { proxy: process.env.SPARQL_ENDPOINT_URL },
  },
  css: [
    '@/assets/buefy-like.scss'
  ],
  typescript: {
    // typeCheck: true,
  },
})
