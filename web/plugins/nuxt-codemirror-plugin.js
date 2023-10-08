import { defineNuxtPlugin } from "#app";
import VueCodemirror from 'vue-codemirror'

// language
import 'codemirror/mode/sparql/sparql.js'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.Vue.use(VueCodemirror)
});
