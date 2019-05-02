<template>
  <div>
    <nav class="navbar has-shadow is-spaced">
      <div class="container">
        <div class="navbar-brand">
          <a class="navbar-item" href="/">
            <img src="~assets/prickathon-logo.png" alt="Buefy" height="28" />
          </a>
          <div class="navbar-burger"><span /><span /><span /></div>
        </div>
        <div class="navbar-menu">
          <div class="navbar-start">
            <a class="navbar-item" href="/">Home</a>
            <div class="navbar-item has-dropdown is-hoverable">
              <a class="navbar-link" href="/rdfs/">RDF</a>
              <div class="navbar-dropdown is-boxed">
                <a class="navbar-item" href="/rdfs/characters/">Characters</a>
                <a class="navbar-item" href="/rdfs/hoge/">Modifiers</a>
                <a class="navbar-item" href="/rdfs/hoge/">Modifiers</a>
                <a class="navbar-item" href="/rdfs/hoge/">Modifiers</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <section class="main-content section">
      <div class="container">
        <nuxt />
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          title: 'Home',
          icon: 'home',
          to: { name: 'index' }
        },
        {
          title: 'Inspire',
          icon: 'lightbulb',
          to: { name: 'inspire' }
        }
      ]
    }
  }
}
</script>
