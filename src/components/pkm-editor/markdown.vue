<template>
  <div class="markdown-editor" :style="{
    height
  }">
    <markdown-editor
      v-model="value"
      :theme="theme"
      :upload="uploadConfig"
      @blur="blurHandler"
      @focus="focusHandler"
      @selectionChange="selectionChangeHandler"
      @themeChange="themeChangeHandler"
      @toolbarItemAction="toolbarItemActionHandler"
      @change="changeHandler"
     />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, PropType, CSSProperties, watch } from 'vue'
import useCommonStore from '@/store/index'

import '@totonoo/vue-codemirror/dist/style.css'
import { MarkdownEditor } from '@totonoo/vue-codemirror'

enum ThemeType {
  DARK = 'dark',
  LIGHT = 'light'
}

interface Props {
  modelValue: string;
  height: CSSProperties['height']
}

export default defineComponent({
  components: {
    MarkdownEditor
  },
  props: {
    modelValue: {
      type: String as PropType<Props['modelValue']>,
      default: ''
    },
    height: {
      type: String as PropType<Props['height']>,
      default: '100%'
    }
  },
  emits: ['update:modelValue', 'change', 'blur', 'focus', 'selectionChange', 'themeChange', 'toolbarItemAction'],
  setup (props, ctx) {
    const store = useCommonStore()
    const theme = {
      def: store.theme === 'dark' ? ThemeType.DARK : ThemeType.LIGHT,
      observer: 'body',
      observerAttr: 'arco-theme'
    }
    const uploadConfig = {
      uploadUrl: '/api/file/upload',
      headers: {
      },
      uploadSuccess: (result: any): string => {
        return result.data.domain + result.data.filepath
      },
      uploadFail: (error: any): void => {
        console.log('console', error)
      }
    }
    const value = ref(props.modelValue)
    watch(() => props.modelValue, (val) => {
      value.value = val
    })

    const blurHandler = (val: string, editor: typeof MarkdownEditor) => {
      ctx.emit('blur', val, editor)
    }
    const focusHandler = (val: string, editor: typeof MarkdownEditor) => {
      ctx.emit('focus', val, editor)
    }
    const selectionChangeHandler = (val: string, editor: typeof MarkdownEditor) => {
      ctx.emit('selectionChange', val, editor)
    }
    const themeChangeHandler = (val: string, editor: typeof MarkdownEditor) => {
      ctx.emit('themeChange', val, editor)
    }
    const toolbarItemActionHandler = (val: string, type: string, editor: typeof MarkdownEditor) => {
      ctx.emit('toolbarItemAction', val, type, editor)
    }
    const changeHandler = (val: string, editor: typeof MarkdownEditor) => {
      ctx.emit('update:modelValue', val)
      ctx.emit('change', val, editor)
    }
    return {
      value,
      theme,
      uploadConfig,
      blurHandler,
      focusHandler,
      selectionChangeHandler,
      themeChangeHandler,
      toolbarItemActionHandler,
      changeHandler
    }
  }
})
</script>
<style lang="scss" scoped>
.markdown-editor {
  --editor-bg-light: var(--color-bg-white);
  --editor-bg-dark: var(--color-black);
}
</style>
