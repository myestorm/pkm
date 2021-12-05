<template>
  <pkm-layout class="pkm-side-bar">
    <pkm-layout-header>
      <side-header></side-header>
    </pkm-layout-header>
    <pkm-layout-content class="content">
      <side-content></side-content>
    </pkm-layout-content>
    <pkm-layout-footer>
      <side-footer></side-footer>
    </pkm-layout-footer>
  </pkm-layout>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import SideHeader from './side-header.vue'
import SideContent from './side-content.vue'
import SideFooter from './side-footer.vue'
export default defineComponent({
  name: 'SideBar',
  components: {
    SideHeader,
    SideContent,
    SideFooter
  },
  setup () {
    return {
    }
  }
})
</script>
<style lang="scss" scoped>
.#{$--prefix}-side-bar {
  width: 100%;
  height: 100%;
  .content {
    position: relative;
  }
}
</style>
