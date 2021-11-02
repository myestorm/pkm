import { createApp } from 'vue'

import ArcoVue from '@arco-design/web-vue'
import '@arco-design/web-vue/es/index.less'

import App from './App.vue'

const app = createApp(App)
app.use(ArcoVue, {
  componentPrefix: 'pkm'
})
app.mount('#app')
