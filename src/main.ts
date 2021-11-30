import { createApp } from 'vue'

import ArcoVue from '@arco-design/web-vue'
import '@arco-design/web-vue/es/index.less'

import Axios from './plugins/axios'

import Router from './router/index'
import { store, key } from './store/index'

import App from './App.vue'

const app = createApp(App)
app.use(ArcoVue, {
  componentPrefix: 'pkm'
})
app.use(Axios)
app.use(Router)
app.use(store, key)
app.mount('#app')
