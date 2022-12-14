import { createApp } from 'vue'
import App from './App.vue'
import router from './router'


//Vue.config.productionTip = false

import axios from 'axios'

// Vue.prototype.$axios = axios
// Vue.prototype.$bus = new Vue()

const app = createApp(App)
app.config.productionTip = false
// app.config.globalProperties.$axios = axios;
app.provide('axios', axios);
app.use(router)
app.mount('#app')
