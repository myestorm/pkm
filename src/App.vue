<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script lang="ts">
import './assets/scss/app.scss'
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useStore  } from './store'
import { authorizeRoutes } from './router'

export default defineComponent({
  setup () {
    const store = useStore()
    const router = useRouter()
    let fullPath = (window.location.pathname || '/') + window.location.search
    fullPath = /^\/signin/.test(fullPath) ? '/' : fullPath

    document.body.setAttribute('arco-theme', 'dark')

    // 动态加载路由
    const addRoute = () => {
      authorizeRoutes.forEach(item => {
        router.addRoute(item)
      })
    }

    // 获取用户信息
    store.dispatch('admin/getUserInfo').then(() => {
      addRoute()
      router.push(fullPath)
    }).catch(() => {
      router.push({
        path: '/signin',
        query: {
          refer: encodeURIComponent(fullPath)
        }
      })
    })
  }
})
</script>
