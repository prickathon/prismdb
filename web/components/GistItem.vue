<script setup lang="ts">
// 
const props = defineProps({
  gistUrl: {
      type: String,
      required: true
  }
})

const m = props.gistUrl.match(
  /https:\/\/gist\.github\.com\/.+?\/([0-9a-z]+)(#.+)?/
) as RegExpMatchArray

const apiUrl = `https://api.github.com/gists/${m[1]}`
const response = await fetch(apiUrl);
const data = await response.json()
const file = data.files[Object.keys(data.files)[0]]

const code = file.content
const cmOptions = {
  mode: file.type,
  lineNumbers: true,
  readOnly: true,
  fullLines: true
}
const title = data.description

// 
const editorLink = `https://prismdb.takanakahiko.me/sparql?qtxt=${encodeURIComponent(code)}`

</script>

<template>
  <div class="card">
    <div
      class="card-header"
      role="button"
    >
      <p class="card-header-title">
        {{ title }}
      </p>
    </div>
    <div class="card-content">
      <div class="content">
        <codemirror
          v-model="code"
          class="codemirror"
          :options="cmOptions"
        />
      </div>
    </div>
    <footer class="card-footer">
      <a
        :href="gistUrl"
        class="card-footer-item"
      >Original Gist</a>
      <a
        :href="editorLink"
        class="card-footer-item"
      >Open</a>
    </footer>
  </div>
</template>

<style scoped>
.card {
  margin-bottom: 20px;
}

p.card-header-title {
  margin-bottom: 0;
}
</style>

<style>
.CodeMirror {
  border: 1px solid #eee;
  height: auto;
}
</style>
