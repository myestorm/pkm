<template>
  <pkm-layout class="pkm-layout-app">
    <pkm-layout-sider class="pkm-layout-sidebar" style="width: 52px;">
      <pc-sidebar />
    </pkm-layout-sider>
    <pkm-layout-content class="pkm-layout-content">
      <pkm-layout class="main">
        <pc-header />
        <pkm-layout-content>
          <router-view></router-view>
        </pkm-layout-content>
      </pkm-layout>
    </pkm-layout-content>
  </pkm-layout>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import PcSidebar from './components/pc-sidebar.vue'
import PcHeader from './components/pc-header.vue'

export default defineComponent({
  components: {
    PcSidebar,
    PcHeader
  }
})
</script>
<style lang="scss" scoped>
.#{$--prefix}-layout-content {
  width: 100%;
  height: 100%;
  .main {
    width: 100%;
    height: 100%;
  }
}
</style>
