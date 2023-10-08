import { defineNuxtPlugin } from "#app";
import VueCodemirror from 'vue-codemirror'
import { StreamLanguage } from "@codemirror/language"
import { sparql } from "@codemirror/legacy-modes/mode/sparql"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueCodemirror, {
    extensions: [StreamLanguage.define(sparql)]
  })
});
