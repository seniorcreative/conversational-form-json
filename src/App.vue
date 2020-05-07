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
@import './assets/main.scss';

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
a, button.plain, button {
  cursor: pointer;
  color: #fff !important;
  background: none;
  border: none;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-family: inherit;
  &:hover, &.active {
    color: #fdb813 !important;
  }
}
button[disabled] {
  opacity: 0.2;
  pointer-events: none;
  cursor: not-allowed;
}
.container {
  height: 100%;
  @media (max-width: 768px) {
    padding: 0 1.5rem;
  }
}
nav {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  margin: 0 !important;
  padding: 1rem;
  background-color: #1a1a1c;
}
section#devpanel {
  position: fixed;
  width: 100%;
  top: -9999px;
  left: -9999px;
}
section#intro {
  padding-top: 4.4rem;
  p {
    color: #fff;
    font-size: 3rem;
    line-height: 1.1;
    margin-bottom: 32px;
    span {
      color: rgba(255,255,255, 0.5);
    }

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }
}
section#menu {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
#formTarget {
  height: calc(100vh - 280px);
}
ul li a, ul li button, button.reload {
  background: none;
  border: none;
  font-size: 2rem;
}
button.reload {
  margin: 2.5rem 0;
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
.conversational-form--show {
  border-radius: 1rem;
}
a.btn-close {
  display: inline-block;
  background: url('./assets/close-icon.svg') no-repeat center center;
  width: 24px;
  height: 24px;
}

button:focus {
  outline: none;
}
</style>
