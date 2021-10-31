<script setup lang="ts">
import MarkdownEditor from './components/editor/MarkdownEditor.vue'
const value = `## title1

~~sdadas~~

**sadsad**

\`test\`

\`\`\`javascript
import { onMounted } from 'vue'
import {EditorState, EditorView, basicSetup} from "@codemirror/basic-setup"
import { markdown, markdownLanguage } from "@codemirror/lang-markdown"
\`\`\`

中文`
</script>

<template>
  <markdown-editor :value="value" />
</template>
