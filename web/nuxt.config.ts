import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2026-04-05',
  app: {
    head: {
      title: 'PrismDB',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'prismdb は プリティーシリーズの二次創作です' }
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    }
  },
  routeRules: {
    '/sparql': { proxy: process.env.SPARQL_ENDPOINT_URL }
  },
  css: [
    '@/assets/buefy-like.css'
  ],
  typescript: {
    typeCheck: true
  },
  serverHandlers: [
    { route: '/api/**', handler: './server/api/index.ts' }
  ]
})
