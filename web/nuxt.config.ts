export default {
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
    'codemirror/lib/codemirror.css',
    // merge css
    'codemirror/addon/merge/merge.css',
    // theme css
    'codemirror/theme/base16-dark.css'
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [{ src: '~plugins/nuxt-codemirror-plugin.js', ssr: false }],
  // some nuxt config...

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://buefy.github.io/#/documentation
    'nuxt-buefy',
    '@nuxtjs/proxy'
  ],
  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  proxy: {
    '/sparql': process.env.SPARQL_ENDPOINT_URL
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
}
