<template>
  <div class="md-editor" :style="{
    height: height
  }">
    <div class="md-editor-toolbar">
      <div class="l">
        <ul class="toolbar">
          <li class="item"><button @click="insert" class="toolbar-btn"><i class="icon-header"></i></button></li>
          <li class="item"><button @click="blod" class="toolbar-btn"><i class="icon-bold"></i></button></li>
          <li class="item"><button @click="blockCode" class="toolbar-btn"><i class="icon-italic"></i></button></li>
          <li class="item"><button @click="blockCode" class="toolbar-btn"><i class="icon-strikethrough"></i></button></li>
          <li class="split"></li>
          <li class="item"><button @click="blockCode" class="toolbar-btn"><i class="icon-hrline"></i></button></li>
          <li class="item"><button @click="blockCode" class="toolbar-btn"><i class="icon-quote"></i></button></li>
          <li class="split"></li>
          <li class="item"><button @click="blockCode" class="toolbar-btn"><i class="icon-unordered-list"></i></button></li>
          <li class="item"><button @click="blockCode" class="toolbar-btn"><i class="icon-ordered-list"></i></button></li>
          <li class="item"><button @click="blockCode" class="toolbar-btn"><i class="icon-task-list"></i></button></li>
          <li class="split"></li>
          <li class="item"><button @click="blockCode" class="toolbar-btn"><i class="icon-table"></i></button></li>
          <li class="item"><button @click="blockCode" class="toolbar-btn"><i class="icon-inline-code"></i></button></li>
          <li class="item"><button @click="blockCode" class="toolbar-btn"><i class="icon-block-code"></i></button></li>
          <li class="split"></li>
          <li class="item"><button @click="blockCode" class="toolbar-btn"><i class="icon-link"></i></button></li>
          <li class="item"><button @click="blockCode" class="toolbar-btn"><i class="icon-media"></i></button></li>
        </ul>
      </div>
      <div class="c"></div>
      <div class="r">
        <ul class="toolbar">
          <li class="item"><button @click="blockCode" class="toolbar-btn"><i class="icon-preview"></i></button></li>
          <li class="item"><button @click="blockCode" class="toolbar-btn"><i class="icon-fullscreen"></i></button></li>
        </ul>
      </div>
    </div>
    <div class="md-editor-body" :id="id"></div>
  </div>
</template>

<script lang="ts">
import { onMounted } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import MarkdownEditor from './MarkdownEditor'
import './Theme.scss'

export default {
  name: 'MarkdownEditor',
  props: {
    value: {
      type: String,
      defaut: ''
    },
    height: {
      type: String,
      default: '100vh'
    }
  },
  setup (props, ctx) {
    const prefix = 'markdown-editor-'
    const id = uuidv4()

    const editor = new MarkdownEditor()
    const init = () => {
      const editorElement: Element | null = document.querySelector(`#${prefix}${id}`)
      if (editorElement) {
        editor.mounted(editorElement, {
          initValue: props.value || ''
        })
        ctx.emit('ready', editor)
      }
    }

    onMounted(() => {
      init()
    })

    return {
      id: prefix + id,
      insert () {
        editor.toggleInsertLineStart('## ')
      },
      blod () {
        editor.toggleAroundSelection('**', '**')
      },
      blockCode () {
        editor.insertAroundLine('```', '```')
      }
    }
  }
}
</script>
