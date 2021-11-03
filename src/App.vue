<template>
  <pkm-layout class="layout-app">
    <pkm-layout-sider class="side-bar">
      <sidebar></sidebar>
    </pkm-layout-sider>
    <pkm-layout-content>
      <router-view></router-view>
    </pkm-layout-content>
  </pkm-layout>
</template>
<script lang="ts">
import './assets/scss/app.scss'
import Sidebar from './components/layout/Sidebar.vue'
export default {
  name: 'App',
  components: {
    Sidebar
  },
  setup () {
    document.body.setAttribute('arco-theme', 'dark')
    return {
    }
  }
}
</script>
