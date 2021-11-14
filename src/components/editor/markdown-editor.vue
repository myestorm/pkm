<template>
  <div class="pkm-md-editor" :id="id" :style="{
    height: height
  }">
    <div class="pkm-md-editor-toolbar" :style="{
      height: toolbarHeight
    }">
      <div class="l">
        <ul class="toolbar">
          <li class="item"><toolbar-header :getEditor="getEditor" /></li>
          <li class="item"><toolbar-blod :getEditor="getEditor" /></li>
          <li class="item"><toolbar-italic :getEditor="getEditor" /></li>
          <li class="item"><toolbar-strikethrough :getEditor="getEditor" /></li>
          <li class="split"></li>
          <li class="item"><toolbar-hrline :getEditor="getEditor" /></li>
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
          <li class="split"></li>
          <li class="item"><button @click="showPreview = !showPreview" class="toolbar-btn"><i class="icon-preview"></i></button></li>
          <li class="item"><button @click="blockCode" class="toolbar-btn"><i class="icon-fullscreen"></i></button></li>
          <li class="item"><button @click="blockCode" class="toolbar-btn"><i class="icon-info"></i></button></li>
        </ul>
      </div>
      <div class="c"></div>
      <div class="r">
        <ul class="toolbar">
          <li class="item"><button @click="blockCode" class="toolbar-btn"><i class="icon-save"></i></button></li>
        </ul>
      </div>
    </div>
    <div class="pkm-md-editor-main" :style="{
      height: `calc(${height} - ${toolbarHeight})`
    }">
      <div class="pkm-md-editor-content" :id="`${id}-editor`"></div>
      <div class="pkm-md-editor-preview" :id="`${id}-preview`" v-show="showPreview"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, reactive } from 'vue'
import { ViewUpdate, EditorView } from '@codemirror/view'
import { v4 as uuidv4 } from 'uuid'
import MarkdownEditor from './markdown-editor'
import './theme.scss'

import ToolbarHeader from './toolbar/header.vue'
import ToolbarBlod from './toolbar/blod.vue'
import ToolbarItalic from './toolbar/italic.vue'
import ToolbarStrikethrough from './toolbar/strikethrough.vue'
import ToolbarHrline from './toolbar/hrline.vue'

export default defineComponent({
  name: 'MarkdownEditor',
  components: {
    ToolbarHeader,
    ToolbarBlod,
    ToolbarItalic,
    ToolbarStrikethrough,
    ToolbarHrline
  },
  emits: ['ready', 'update:value', 'change', 'focus', 'blur', 'editorSave'],
  props: {
    value: {
      type: String,
      defaut: ''
    },
    autoPreview: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: '100vh'
    },
    toolbarHeight: {
      type: String,
      default: '48px'
    }
  },
  setup (props, ctx) {
    const prefix = 'markdown-editor-'
    const id = uuidv4()
    const showPreview = ref(props.autoPreview)

    let editor: MarkdownEditor
    const init = () => {
      editor = new MarkdownEditor({
        id: prefix + id,
        initValue: props.value || '',
        events: {
          focus (update: ViewUpdate) {
            ctx.emit('focus', update, editor)
          },
          blur (update: ViewUpdate) {
            ctx.emit('blur', update, editor)
          },
          change (update: ViewUpdate) {
            const value = editor.getValue()
            ctx.emit('update:value', value)
            ctx.emit('change', update, editor)
          },
          save (view: EditorView) {
            const value = editor.getValue()
            ctx.emit('editorSave', value, view, editor)
          }
        }
      })
      ctx.emit('ready', editor)
    }

    onMounted(() => {
      init()
    })

    return {
      id: prefix + id,
      showPreview,
      getEditor () {
        return editor
      },
      blockCode () {
        editor.insertAroundLine('```', '```')
      }
    }
  }
})
</script>
