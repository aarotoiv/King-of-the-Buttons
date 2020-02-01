import Vue from 'vue'
import App from './App'
import router from './router'


Vue.config.productionTip = false


new Vue({
  router,
  templates: '<App />',
  render: h => h(App),
  components: { App }
}).$mount('#app')
