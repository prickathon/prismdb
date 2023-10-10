import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  app: {
    head: {
      title: 'PrismDB',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'prismdb は プリティーシリーズの二次創作です' }
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    }
  },
  routeRules: {
    '/sparql': { proxy: process.env.SPARQL_ENDPOINT_URL }
  },
  css: [
    '@/assets/buefy-like.scss'
  ],
  typescript: {
    typeCheck: true
  },
  serverHandlers: [
    { route: '/api/**', handler: './server/api/index.ts' }
  ]
})
