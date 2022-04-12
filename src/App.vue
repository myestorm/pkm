<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script lang="ts">
import './assets/scss/app.scss'
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import useCommonStore from './store/index'
import useAdminStore from './store/modules/admin/index'
import { authorizeRoutes } from './router'

export default defineComponent({
  setup () {
    const store = useCommonStore()
    const storeAdmin = useAdminStore()
    const router = useRouter()
    const isMobile = store.system.isMobile
    const defaultHome = isMobile ? '/m/home' : '/p/home'
    
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

    // 获取用户信息
    storeAdmin.getUserinfo().then(() => {
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
