<template>
  <pkm-layout class="pkm-layout-app">
    <pkm-layout-sider class="pkm-layout-sidebar">
      <sidebar></sidebar>
    </pkm-layout-sider>
    <pkm-layout-content class="pkm-layout-content">
      <router-view></router-view>
    </pkm-layout-content>
  </pkm-layout>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import Sidebar from './side-bar.vue'

export default defineComponent({
  components: {
    Sidebar
  }
})
</script>
