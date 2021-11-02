<template>
  <pkm-layout class="layout-app">
    <pkm-layout-sider collapsible breakpoint="xl" class="aside"></pkm-layout-sider>
    <pkm-layout-content>
      <markdown-editor :value="value" />
    </pkm-layout-content>
  </pkm-layout>
</template>
<script lang="ts">
import './assets/scss/app.scss'
import MarkdownEditor from './components/editor/MarkdownEditor.vue'
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
    document.body.setAttribute('arco-theme', 'dark')
    return {
      value
    }
  }
}
</script>
