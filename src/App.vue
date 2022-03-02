<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script lang="ts">
import './assets/scss/app.scss'
import { defineComponent, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore  } from './store'
import { authorizeRoutes } from './router'

export default defineComponent({
  setup () {
    const store = useStore()
    const router = useRouter()
    const isMobile = computed(() => store.getters['getIsMobile'])
    const defaultHome = isMobile.value ? '/m/home' : '/p/home'
    
    let pathName = window.location.pathname
    if (!pathName || pathName === '/' || /^\/signin/.test(pathName)) {
      pathName = defaultHome
    }

    const fullPath = pathName + window.location.search

    // 动态加载路由
    const addRoute = () => {
      authorizeRoutes.forEach(item => {
        router.addRoute(item)
      })
    }
    addRoute()
    router.push(fullPath)

    // 获取用户信息
    // store.dispatch('admin/getUserInfo').then(() => {
    //   addRoute()
    //   router.push(fullPath)
    // }).catch(() => {
    //   router.push({
    //     path: '/signin',
    //     query: {
    //       refer: encodeURIComponent(fullPath)
    //     }
    //   })
    // })
  }
})
</script>
