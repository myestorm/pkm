<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { onMounted } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import {EditorState, EditorView, basicSetup} from "@codemirror/basic-setup"
import { markdown, markdownLanguage } from "@codemirror/lang-markdown"
import { defaultHighlightStyle } from "@codemirror/highlight"
import { lineNumbers, highlightActiveLineGutter } from '@codemirror/gutter';

import {gutter, GutterMarker} from "@codemirror/gutter"
import {foldGutter} from "@codemirror/fold"

import {StateField, StateEffect} from "@codemirror/state"
import {RangeSet} from "@codemirror/rangeset"

const emptyMarker = new class extends GutterMarker {
  toDOM() { return document.createTextNode("ø") }
}

const emptyLineGutter = gutter({
  lineMarker(view, line) {
    console.log(line)
    return line.from == line.to ? emptyMarker : null
  },
  initialSpacer: () => emptyMarker
})

const foldGutterInout = foldGutter({
  openText: 'a',
  closedText: 'b'
})

let baseTheme = EditorView.baseTheme({
  ".cm-content": {
    fontFamily: "Consolas, 'Courier New', 'Microsoft YaHei', monospace, sans-serif",
    fontSize: '14px',
    lineHeight: '1.3'
  },
  ".cm-gutter": {
    fontFamily: "Consolas, 'Courier New', monospace, sans-serif",
    fontSize: '14px',
    lineHeight: '1.5'
  },
  ".cm-breakpoint-gutter .cm-gutterElement": {
    color: "red",
    paddingLeft: "5px",
    cursor: "default"
  }
})



let state = EditorState.create({doc: `## title1

~~sdadas~~

**sadsad**

\`test\`

\`\`\`javascript
import { onMounted } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import {EditorState, EditorView, basicSetup} from "@codemirror/basic-setup"
import { markdown, markdownLanguage } from "@codemirror/lang-markdown"
\`\`\`

中文
`, extensions: [
  // basicSetup,
  lineNumbers(),
  foldGutterInout,
  emptyLineGutter,
  baseTheme,
  markdown({
    base: markdownLanguage
  }),
  defaultHighlightStyle
]})

onMounted(() => {
  let view = new EditorView({
    state: state,
    parent: document.querySelector('#editor')
  })
})
</script>

<template>
  <div id="editor" style="height: 400px"></div>
</template>

<style>
#app {
  font-family: Consolas, 'Courier New', monospace sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
.cm-editor {
  height: 100%;
  border: 1px #2c3e50 solid;
  font-family: Consolas, 'Courier New', monospace sans-serif;
}
</style>
