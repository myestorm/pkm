<template>
  <pkm-drawer width="100%" :visible="modelValue" :ok-loading="loading" @ok="handleOk" @cancel="handleCancel" unmountOnClose>
    <template #title>
      {{ type == 'document' ? '文档' : '目录' }}
    </template>
    <div>
      <file-form ref="fileForm" :type="type" :initValue="initValue" v-model:loading="loading" @success="handleCancel" />
    </div>
  </pkm-drawer>
</template>
<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue'
import { IDocumentTypeType, IDocumentFormType } from '../../../types/document'
import FileForm from './form.vue'

export interface FileFormDrawerProps {
  modelValue: boolean,
  type: IDocumentTypeType,
  initValue: IDocumentFormType
}

export default defineComponent({
  name: 'FileFormDrawer',
  props: {
    modelValue: {
      type: Boolean as PropType<FileFormDrawerProps['modelValue']>,
      default: false
    },
    type: {
      type: String as PropType<FileFormDrawerProps['type']>,
      default: IDocumentTypeType.DOC
    },
    initValue: {
      type: Object as PropType<FileFormDrawerProps['initValue']>,
      default: () => {}
    }
  },
  components: {
    FileForm
  },
  emits: ['update:modelValue', 'success'],
  setup (props, ctx) {
    const fileForm = ref()
    const loading = ref(false)
    const handleOk = () => {
      fileForm.value.save()
    }
    const handleCancel = () => {
      ctx.emit('update:modelValue', false)
      ctx.emit('success')
    }

    return {
      fileForm,
      loading,
      handleOk,
      handleCancel
    }
  }
})
</script>
