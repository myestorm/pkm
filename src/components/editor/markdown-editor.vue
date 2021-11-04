<template>
  <div class="pkm-md-editor" :style="{
    height: height
  }">
    <div class="pkm-md-editor-toolbar" :style="{
      height: toolbarHeight
    }">
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
          <li class="item"><button @click="showPreview = !showPreview" class="toolbar-btn"><i class="icon-preview"></i></button></li>
          <li class="item"><button @click="blockCode" class="toolbar-btn"><i class="icon-fullscreen"></i></button></li>
        </ul>
      </div>
    </div>
    <div class="pkm-md-editor-main" :style="{
      height: `calc(${height} - ${toolbarHeight})`
    }">
      <div class="pkm-md-editor-content" :id="id"></div>
      <div class="pkm-md-editor-preview" :id="`${id}-prevview`" v-if="showPreview">
        <iframe src="about:blank" :id="`${id}-iframe`" @load="previewLoaded"></iframe>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import MarkdownEditor from './markdown-editor'
import MarkdownPreview from './markdown-preview'
import './theme.scss'

export default defineComponent({
  name: 'MarkdownEditor',
  props: {
    value: {
      type: String,
      defaut: ''
    },
    autoPreview: {
      type: Boolean,
      default: true
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
    
    const preview = new MarkdownPreview()
    const editor = new MarkdownEditor()
    const init = () => {
      const editorElement: Element | null = document.querySelector(`#${prefix}${id}`)
      if (editorElement) {
        editor.mounted(editorElement, {
          initValue: props.value || '',
          preview
        })
        ctx.emit('ready', editor)
      }
    }

    onMounted(() => {
      init()
    })

    return {
      id: prefix + id,
      showPreview,
      previewLoaded () {
        if (props.autoPreview) {
          const iframeElement: Element | null = document.querySelector(`#${prefix}${id}-iframe`)
          preview.init(iframeElement)
          preview.update(props.value)
        }
      },
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
})
</script>
