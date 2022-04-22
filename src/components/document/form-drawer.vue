<template>
  <pkm-drawer :width="width" :visible="modelValue" :ok-loading="loading" @ok="handleOk" @cancel="handleCancel" unmountOnClose>
    <template #title>
      {{ type == 'document' ? '文档' : '目录' }}
    </template>
    <pkm-spin dot :loading="loading">
      <document-form ref="documentForm" :id="id" />
    </pkm-spin>
  </pkm-drawer>
</template>
<script lang="ts">
import { defineComponent, PropType, ref, CSSProperties } from 'vue'

import DocumentForm from './form.vue'

export interface FileFormDrawerProps {
  modelValue: boolean,
  id: string,
  width: CSSProperties['width']
}

export default defineComponent({
  name: 'DocumentFormDrawer',
  props: {
    modelValue: {
      type: Boolean as PropType<FileFormDrawerProps['modelValue']>,
      default: false
    },
    id: {
      type: String as PropType<FileFormDrawerProps['id']>,
      default: ''
    },
    width: {
      type: String as PropType<FileFormDrawerProps['width']>,
      default: '420px'
    }
  },
  components: {
    DocumentForm
  },
  emits: ['update:modelValue'],
  setup (props, ctx) {
    const documentForm = ref()
    const loading = ref(false)

    const handleOk = () => {
      loading.value = true
      documentForm.value.submit().then(() => {
        ctx.emit('update:modelValue', false)
      }).finally(() => {
        loading.value = false
      })
    }
    const handleCancel = () => {
      ctx.emit('update:modelValue', false)
    }

    const creatDocument = () => {
      documentForm.value.creatDocument()
    }

    const creatFolder = () => {
      documentForm.value.creatFolder()
    }

    return {
      documentForm,
      loading,
      handleOk,
      handleCancel,
      creatDocument,
      creatFolder
    }
  }
})
</script>
