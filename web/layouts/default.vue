<template>
  <div>
    <nav class="navbar has-shadow is-spaced">
      <div class="container">
        <div class="navbar-brand">
          <a class="navbar-item" href="/">
            <img src="~assets/prickathon-logo.png" alt="Buefy" height="28">
          </a>
          <div
            class="navbar-burger"
            :class="{ 'is-active': menuActive }"
            @click="menuToggle()"
          >
            <span /><span /><span />
          </div>
        </div>
        <div class="navbar-menu" :class="{ 'is-active': menuActive }">
          <div class="navbar-start">
            <a class="navbar-item" href="/">Home</a>
            <div class="navbar-item has-dropdown is-hoverable">
              <a class="navbar-link" href="/rdfs/">RDF</a>
              <div class="navbar-dropdown is-boxed">
                <a class="navbar-item" href="/rdfs/character/">Characters</a>
                <a class="navbar-item" href="/rdfs/team/">Teams</a>
                <a class="navbar-item" href="/rdfs/episode/">Episodes</a>
                <a class="navbar-item" href="/rdfs/song/">Songs</a>
                <a class="navbar-item" href="/rdfs/live/">Lives</a>
                <a class="navbar-item" href="/rdfs/series/">Series</a>
                <a class="navbar-item" href="/rdfs/item/">Items</a>
                <a class="navbar-item" href="/rdfs/brand/">Brands</a>
                <a class="navbar-item" href="/rdfs/shop/">Shops</a>
              </div>
            </div>
          </div>
          <div class="navbar-end">
            <div class="navbar-item">
              <a class="button is-light" href="/sparql/">Sparql Endpoint</a>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <nuxt />

    <footer class="footer">
      <div class="content has-text-centered">
        <p>
          <a href="/privacy-policy">Privacy Policy</a>
        </p>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data () {
    return {
      menuActive: false
    }
  },
  watch: {
    $route () {
      this.menuActive = false
    }
  },
  methods: {
    menuToggle () {
      this.menuActive = !this.menuActive
    }
  }
})
</script>
