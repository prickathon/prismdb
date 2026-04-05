import { StreamLanguage } from "@codemirror/language";
import { sparql } from "@codemirror/legacy-modes/mode/sparql";
import { oneDark } from "@codemirror/theme-one-dark";
import VueCodemirror from "vue-codemirror";
import { defineNuxtPlugin } from "#imports";

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.use(VueCodemirror, {
		extensions: [StreamLanguage.define(sparql), oneDark],
	});
});
