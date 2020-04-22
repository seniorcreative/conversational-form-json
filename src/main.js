import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
// import JsonEditor from 'vue-json-edit'
import Element from 'element-ui'
import './../node_modules/bulma/css/bulma.css'

Vue.use(Element)
// Vue.use(JsonEditor)

Vue.config.productionTip = false

window.$ = window.jQuery

new Vue({
  render: h => h(App)
}).$mount('#app')
