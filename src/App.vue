<template>
  <div id="app">
    <section class="container">
      <Start msg="Conversational Form Experiment"/>
    </section>
  </div>
</template>

<script>
import Start from './components/Start.vue'

export default {
  name: 'App',
  components: {
    Start
  }
}
</script>

<style lang="scss">
@import url('./assets/main.scss');
html, body {
  height: 100%;
}
#app {
  font-family: 'Neue Haas Grotesk Display Pro', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: 500;
  text-align: center;
  height: 100%;
}
section {
  height: 90vh;
  margin-top: 10vh;
}
.controls {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1000;
}
.columns {
  height: 100%;
}
</style>
