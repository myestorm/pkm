<template>
  <mobile-layout title="文档" subtitle="祖国富强民主，八荣八耻" :footer="false">
      <template #main>
        <div class="markdown-editor">
          <MarkdownEditor @change="change" />
        </div>
      </template>
  </mobile-layout>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import MobileLayout from '../../components/layout/mobile-layout.vue'

import '@totonoo/vue-codemirror/dist/style.css'
import { MarkdownEditor } from '@totonoo/vue-codemirror'

export default defineComponent({
  components: {
    MobileLayout,
    MarkdownEditor
  },
  setup () {
    return {
      change (val: string) {
        console.log(val)
      }
    }
  },
})
</script>
<style lang="scss" scoped>
.markdown-editor {
  height: calc(100vh - 76px);
}
</style>
