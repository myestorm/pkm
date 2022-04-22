<template>
  <pkm-layout class="pkm-file-layout">
    <book-sider />
    <pkm-layout-content>
      <router-view></router-view>
    </pkm-layout-content>
  </pkm-layout>
</template>
<script lang="ts">
import { defineComponent, ref, getCurrentInstance } from 'vue'

import BookSider from './book-sider.vue'

export default defineComponent({
  components: {
    BookSider
  }
})
</script>
<style lang="scss" scoped>
.#{$--prefix}-file-layout {
  width: 100%;
  height: 100%;
}
</style>
