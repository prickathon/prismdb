import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  mode: true,

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },

  /*
   ** Global CSS
   */
  css: [
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
  ],

  routeRules: {
    '/sparql': { proxy: process.env.SPARQL_ENDPOINT_URL },
  },

  typescript: {
    typeCheck: true,
    ignoreNotFoundWarnings: true
  },

  /*
   ** Build configuration
   */
  build: {
  },
  buildModules: [],
  vite: {
    devBundler: 'legacy'
  }
})
