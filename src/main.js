import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import Element from 'element-ui'
import './../node_modules/bulma/css/bulma.css'

Vue.use(Element)

Vue.config.productionTip = false

window.$ = window.jQuery

new Vue({
  render: h => h(App)
}).$mount('#app')
