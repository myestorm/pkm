<template>
  <pkm-layout class="pkm-layout-app">
    <pkm-layout-sider class="pkm-layout-sidebar">
      <sidebar></sidebar>
    </pkm-layout-sider>
    <pkm-layout-content class="pkm-layout-content">
      <!-- <router-view></router-view> -->
    </pkm-layout-content>
  </pkm-layout>
</template>
<script lang="ts">
import './assets/scss/app.scss'
import { defineComponent } from 'vue'
import Sidebar from './components/layout/side-bar.vue'

export default defineComponent({
  components: {
    Sidebar
  },
  setup () {
    document.body.setAttribute('arco-theme', 'dark')
    return {
      a: document.querySelector('.vh-100') 
    }
  }
})
</script>
<style lang="scss" scoped>
</style>

