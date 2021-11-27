<template>
  <button class="toolbar-btn"><i class="icon-fullscreen"></i></button>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    getEditor: {
      type: Function,
      default: () => null
    }
  },
  setup (props) {
  }
})
</script>
