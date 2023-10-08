import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  mode: 'universal',

  /*
   ** Headers of the page
   */
  head: {
    title: 'PrismDB',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'prismdb は プリティーシリーズの二次創作です' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

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
  buildModules: ['@nuxt/typescript-build'],
  serverMiddleware: [
    { path: '/api', handler: '~/api/index.ts' }
  ]
})
