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
  background-color: #1a1a1c !important;
}
#app {
  font-family: 'Neue Haas Grotesk Display Pro', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: normal;
  text-align: center;
  height: 100%;
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
a, button.plain {
  cursor: pointer;
  color: #fff !important;
  background: none;
  border: none;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-family: inherit;
  &:hover {
    color: #fdb813 !important;
  }
}
.container {
  height: 100%;
  div:first-of-type {
    height: 100%;
  }
}
nav {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  margin: 0 !important;
  padding: 1.5rem;
  background-color: #1a1a1c;
}
section#devpanel {
  margin-top: 6rem;
}
section#intro {
  padding-top: 6rem;
  p {
    color: #fff;
    font-size: 2rem;
    line-height: 1.25;
    span {
      color: rgba(255,255,255, 0.5);
    }
  }
}
section#menu {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
section#conversations {
  height: calc(100vh - 200px);
  margin-top: 200px;
}
nav {
  margin: 1rem 0;
}
ul li a {
  font-size: 2rem;
}
form {
  text-align: left;
}
.code {
  font-family: monospace;
  height: 100vh;
  width: 100%;
  margin: 0;
  overflow: scroll;
  text-align: left;
  font-size: 0.8rem;
  color: #000;
  line-height: 1.8;
}
.intro {
  padding: 2rem 0;
}
</style>
