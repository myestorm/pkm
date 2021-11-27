<template>
  <button @click="handler" class="toolbar-btn"><i class="icon-ordered-list"></i></button>
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
    return {
      handler () {
        const editor = props.getEditor()
        editor.insertStartPerLine('{num}. ')
      }
    }
  }
})
</script>
