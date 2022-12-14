import Vue from 'vue'
import App from './App.vue'
import $ from 'jquery';

import '@/assets/editor.css'
import '@/assets/reset.css'


Vue.config.productionTip = false

window.$ = $;

new Vue({
  render: h => h(App),
}).$mount('#app')
