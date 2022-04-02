<template>
  <mobile-layout title="文档" subtitle="祖国富强民主，八荣八耻" :footer="false" class="editor-page" :style="{
    paddingLeft: '0',
    paddingRight: '0',
    paddingBottom: '0'
  }">
      <template #main>
        <div class="markdown-editor">
          <markdown-editor v-model="value" @change="change" height="calc(100vh - 64px)" />
        </div>
      </template>
  </mobile-layout>
</template>
<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useStore  } from '../../store'
import MobileLayout from '../../components/layout/mobile-layout.vue'
import MarkdownEditor from '../../components/editor/markdown.vue'

export default defineComponent({
  components: {
    MobileLayout,
    MarkdownEditor
  },
  setup () {
    const store = useStore()
    const value = ref('sadasdsadsa')
    const isMobile = computed(() => store.getters['getIsMobile'])
    setTimeout(() => {
      value.value = 'jianjian'
    }, 3000)
    return {
      isMobile,
      value,
      change (val: string) {
        console.log(val)
      }
    }
  },
})
</script>
