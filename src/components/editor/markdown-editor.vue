<template>
  <div class="pkm-md-editor" :class="[isFullscreen ? 'pkm-md-editor-fullscreen' : '']" :id="id" :style="{
    height: height
  }">
    <div class="pkm-md-editor-toolbar" :style="{
      height: toolbarHeight
    }">
      <div class="l">
        <ul class="toolbar">
          <li class="item" v-if="toolbarIsShowItem('header')"><toolbar-header :getEditor="getEditor" /></li>
          <li class="item" v-if="toolbarIsShowItem('blod')"><toolbar-blod :getEditor="getEditor" /></li>
          <li class="item" v-if="toolbarIsShowItem('italic')"><toolbar-italic :getEditor="getEditor" /></li>
          <li class="item" v-if="toolbarIsShowItem('strikethrough')"><toolbar-strikethrough :getEditor="getEditor" /></li>
          <li class="split"></li>
          <li class="item" v-if="toolbarIsShowItem('hrline')"><toolbar-hrline :getEditor="getEditor" /></li>
          <li class="item" v-if="toolbarIsShowItem('quote')"><toolbar-quote :getEditor="getEditor" /></li>
          <li class="split"></li>
          <li class="item" v-if="toolbarIsShowItem('unordered-list')"><toolbar-unordered-list :getEditor="getEditor" /></li>
          <li class="item" v-if="toolbarIsShowItem('ordered-list')"><toolbar-ordered-list :getEditor="getEditor" /></li>
          <li class="item" v-if="toolbarIsShowItem('task-list')"><toolbar-task-list :getEditor="getEditor" /></li>
          <li class="split"></li>
          <li class="item" v-if="toolbarIsShowItem('table')"><toolbar-table :getEditor="getEditor" /></li>
          <li class="item" v-if="toolbarIsShowItem('inline-code')"><toolbar-inline-code :getEditor="getEditor" /></li>
          <li class="item" v-if="toolbarIsShowItem('block-code')"><toolbar-block-code :getEditor="getEditor" /></li>
          <li class="split"></li>
          <li class="item" v-if="toolbarIsShowItem('link')"><toolbar-link :getEditor="getEditor" /></li>
          <li class="item" v-if="toolbarIsShowItem('media')"><toolbar-media :getEditor="getEditor" /></li>
          <li class="split"></li>
          <li class="item" v-if="toolbarIsShowItem('format')"><toolbar-format @click="format" :getEditor="getEditor" /></li>
          <li class="item" v-if="toolbarIsShowItem('preview')"><toolbar-preview @click="preview" :getEditor="getEditor" /></li>
          <li class="item" v-if="toolbarIsShowItem('fullscreen')"><toolbar-fullscreen @click="fullscreen" :getEditor="getEditor" /></li>
        </ul>
      </div>
      <div class="c"></div>
      <div class="r">
        <ul class="toolbar">
          <li class="item" v-if="toolbarIsShowItem('info')">
            <toolbar-info :getEditor="getEditor" @click="$emit('infoClick')" />
            <slot name="info"></slot>
          </li>
          <li class="item" v-if="toolbarIsShowItem('save')"><toolbar-save @click="save" :getEditor="getEditor" /></li>
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
import { defineComponent, onMounted, watch, ref, reactive } from 'vue'
import { ViewUpdate, EditorView } from '@codemirror/view'
import { v4 as uuidv4 } from 'uuid'
import MarkdownEditor from './markdown-editor'
import './theme.scss'

import ToolbarHeader from './toolbar/header.vue'
import ToolbarBlod from './toolbar/blod.vue'
import ToolbarItalic from './toolbar/italic.vue'
import ToolbarStrikethrough from './toolbar/strikethrough.vue'
import ToolbarHrline from './toolbar/hrline.vue'
import ToolbarQuote from './toolbar/quote.vue'
import ToolbarUnorderedList from './toolbar/unordered-list.vue'
import ToolbarOrderedList from './toolbar/ordered-list.vue'
import ToolbarTaskList from './toolbar/task-list.vue'
import ToolbarTable from './toolbar/table.vue'
import ToolbarInlineCode from './toolbar/inline-code.vue'
import ToolbarBlockCode from './toolbar/block-code.vue'
import ToolbarLink from './toolbar/link.vue'
import ToolbarMedia from './toolbar/media.vue'
import ToolbarPreview from './toolbar/preview.vue'
import ToolbarFullscreen from './toolbar/fullscreen.vue'
import ToolbarInfo from './toolbar/info.vue'
import ToolbarSave from './toolbar/save.vue'
import ToolbarFormat from './toolbar/format.vue'

export default defineComponent({
  name: 'MarkdownEditor',
  components: {
    ToolbarHeader,
    ToolbarBlod,
    ToolbarItalic,
    ToolbarStrikethrough,
    ToolbarHrline,
    ToolbarQuote,
    ToolbarUnorderedList,
    ToolbarOrderedList,
    ToolbarTaskList,
    ToolbarTable,
    ToolbarInlineCode,
    ToolbarBlockCode,
    ToolbarLink,
    ToolbarMedia,
    ToolbarPreview,
    ToolbarFullscreen,
    ToolbarInfo,
    ToolbarSave,
    ToolbarFormat
  },
  emits: ['ready', 'update:value', 'change', 'focus', 'blur', 'editorSave', 'format', 'infoClick'],
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
    toolbar: {
      type: Array,
      default: () => [
        ['header', 'blod', 'italic', 'strikethrough', 'hrline', 'quote', 'unordered-list', 'ordered-list', 'task-list', 'table', 'inline-code', 'block-code', 'media', 'preview', 'fullscreen'],
        [],
        ['info', 'save']
      ]
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
    const isFullscreen = ref(false)
    const toolbarFormat = ref(null)

    let editor: MarkdownEditor
    const save = (view: EditorView) => {
      const value = editor.getValue()
      ctx.emit('editorSave', value, view, editor)
    }
    const focus = (update: ViewUpdate) => {
      ctx.emit('focus', update, editor)
    }
    const blur = (update: ViewUpdate) => {
      ctx.emit('blur', update, editor)
    }
    const change = (update: ViewUpdate) => {
      const value = editor.getValue()
      ctx.emit('update:value', value)
      ctx.emit('change', update, editor)
    }
    const format = (view: EditorView) => {
      const { old, value } = editor.format()
      ctx.emit('format', value, old, view, editor)
    }
    const init = () => {
      editor = new MarkdownEditor({
        id: prefix + id,
        initValue: props.value || '',
        events: {
          focus,
          blur,
          change,
          save,
          format
        }
      })
      ctx.emit('ready', editor)
    }

    onMounted(() => {
      init()
    })
    watch(() => props.value, (val) => {
      if (val !== editor.getValue()) {
        editor.setValue(val)
      }
    })

    const toolbarIsShowItem = (key: string) => {
      const toolbar = props.toolbar as unknown as string[][]
      const _all = toolbar.flat()
      return _all.includes(key)
    }

    return {
      id: prefix + id,
      showPreview,
      isFullscreen,
      toolbarFormat,
      getEditor () {
        return editor
      },
      preview () {
        showPreview.value = !showPreview.value
      },
      fullscreen () {
        isFullscreen.value = !isFullscreen.value
      },
      save () {
        save(editor.view)
      },
      format () {
        format(editor.view)
      },
      toolbarIsShowItem
    }
  }
})
</script>
