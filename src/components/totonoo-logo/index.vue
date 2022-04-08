<template>
  <div class="totonoo-logo" :style="style"><Logo /></div>
</template>
<script lang="ts">
import { defineComponent, PropType, CSSProperties } from 'vue'
import Logo from '../../assets/logo/logo.svg?component'

export interface TotonooLogoProps {
  style: CSSProperties
}

export default defineComponent({
  components: {
    Logo
  },
  props: {
    style: {
      type: Object as PropType<TotonooLogoProps['style']>,
      default: {
        // color: '#009844',
        color: 'var(--color-fill-2)',
        width: '72px',
        height: '72px'
      }
    }
  }
})
</script>
<style lang="scss" scoped>
.totonoo-logo {
  display: inline-block;
  margin: 0 auto;
}
</style>
