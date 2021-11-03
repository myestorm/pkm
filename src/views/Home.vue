<template>
  <pkm-layout class="layout-app">
    <pkm-layout-sider class="aside">
      <pkm-layout class="home-side-bar">
        <pkm-layout-header>
          <pkm-input-search :style="{width:'100%', height: `${hh}px`}" placeholder="输入关键字搜索" loading />
        </pkm-layout-header>
        <pkm-layout-content>
          <pkm-list :max-height="200" :bordered="false" @reach-bottom="reachBottom">
            <template #header>
              List title
              <pkm-button type="primary">Primary</pkm-button>
            </template>
            <pkm-list-item>Beijing Bytedance Technology Co., Ltd.</pkm-list-item>
            <pkm-list-item>Bytedance Technology Co., Ltd.</pkm-list-item>
            <pkm-list-item>Beijing Toutiao Technology Co., Ltd.</pkm-list-item>
            <pkm-list-item>Beijing Volcengine Technology Co., Ltd.</pkm-list-item>
            <pkm-list-item>China Beijing Bytedance Technology Co., Ltd.</pkm-list-item>
          </pkm-list>
        </pkm-layout-content>
      </pkm-layout>
    </pkm-layout-sider>
    <pkm-layout-content>
      <markdown-editor :value="value" />
    </pkm-layout-content>
  </pkm-layout>
</template>
<script lang="ts">
import { ref } from 'vue'
import '../assets/scss/app.scss'
import MarkdownEditor from '../components/editor/MarkdownEditor.vue'
const value = `## title1

~~sdadas~~

**sadsad**

\`test\`

\`\`\`javascript
import { onMounted } from 'vue'
import { EditorState, EditorView, basicSetup } from "@codemirror/basic-setup"
import { markdown, markdownLanguage } from "@codemirror/lang-markdown"
\`\`\`

中文`
export default {
  name: 'App',
  components: {
    MarkdownEditor
  },
  setup () {
    const hh = 46
    const vh = document.body.clientHeight
    const loading = ref(true)
    let data = ref([])
    return {
      hh,
      vh,
      loading,
      value,
      data,
      reachBottom () {},
      handleSearch (value: string) {
        // if (value) {
        //   data = [...Array(5)].map((_, index) => `${value}-${index}`)
        // } else {
        //   data = []
        // }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.home-side-bar {
  height: calc(100vh - 2px);
}
</style>
