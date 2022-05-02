<template>
  <pkm-layout class="pkm-totonoo-layout">
    <pkm-layout-sider class="pkm-layout-sidebar" style="width: 52px;">
      <totonoo-sidebar />
    </pkm-layout-sider>
    <pkm-layout-content class="layout-content">
      <pkm-layout class="main">
        <totonoo-header />
        <pkm-divider class="divider" />
        <pkm-layout-content class="content">
          <router-view></router-view>
        </pkm-layout-content>
      </pkm-layout>
    </pkm-layout-content>
  </pkm-layout>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import TotonooSidebar from './blocks/sidebar.vue'
import TotonooHeader from './blocks/header.vue'

export default defineComponent({
  components: {
    TotonooSidebar,
    TotonooHeader
  }
})
</script>
<style lang="scss" scoped>
.#{$--prefix}-layout {
  width: 100%;
  height: 100%;
  .layout-content {
    width: 100%;
    height: 100%;
    .main {
      width: 100%;
      height: 100%;
    }
    .divider {
      margin: 0;
    }
    .content {
      overflow: auto;
    }
  }
}
</style>
