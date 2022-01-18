import { createApp } from 'vue'

import ArcoVue from '@arco-design/web-vue'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import '@arco-design/web-vue/es/index.less'

import Axios from './plugins/axios'
import Utils from './plugins/utils'

import Router from './router/index'
import { store, key } from './store/index'

import App from './App.vue'

const app = createApp(App)
app.use(ArcoVue, {
  componentPrefix: 'pkm'
})
app.use(ArcoVueIcon)
app.use(Utils)
app.use(Axios)
app.use(Router)
app.use(store, key)
app.mount('#app')
