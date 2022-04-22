<template>
  <pkm-layout class="pkm-file-layout">
    <file-sider />
    <pkm-layout-content>
      <router-view></router-view>
    </pkm-layout-content>
  </pkm-layout>
</template>
<script lang="ts">
import { defineComponent, ref, getCurrentInstance } from 'vue'

import FileSider from './file-sider.vue'

export default defineComponent({
  components: {
    FileSider
  }
})
</script>
<style lang="scss" scoped>
.#{$--prefix}-file-layout {
  width: 100%;
  height: 100%;
}
</style>
