<template>
  <mobile-layout title="文档" subtitle="祖国富强民主，八荣八耻" :footer="false" class="editor-page" :style="{
    paddingLeft: '0',
    paddingRight: '0',
    paddingBottom: '0'
  }">
      <template #main>
        <div class="markdown-editor">
          <MarkdownEditor @change="change" :helper="{
            theme: false,
            hotkey: !isMobile
          }" :config="{
            theme: 'light',
            themeAttr: 'arco-theme'
          }" />
        </div>
      </template>
  </mobile-layout>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore  } from '../../store'
import MobileLayout from '../../components/layout/mobile-layout.vue'

import '@totonoo/vue-codemirror/dist/style.css'
import { MarkdownEditor } from '@totonoo/vue-codemirror'

export default defineComponent({
  components: {
    MobileLayout,
    MarkdownEditor
  },
  setup () {
    const store = useStore()
    const isMobile = computed(() => store.getters['getIsMobile'])
    return {
      isMobile,
      change (val: string) {
        console.log(val)
      }
    }
  },
})
</script>
<style lang="scss" scoped>
.markdown-editor {
  // --editor-bg: --my-app-bg;
  // --editor-bg-dark: --home-color-bg-1;
  height: calc(100vh - 64px);
}
</style>
