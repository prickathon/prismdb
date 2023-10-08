import { defineNuxtPlugin } from "#app";
import VueCodemirror from 'vue-codemirror'
import { StreamLanguage } from "@codemirror/language"
import { sparqle } from "@codemirror/legacy-modes/mode/sparql"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.Vue.use(VueCodemirror, {
    extensions: [StreamLanguage.define(sparqle)]
  })
});
