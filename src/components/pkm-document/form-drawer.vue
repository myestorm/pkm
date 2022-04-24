<template>
  <pkm-drawer :width="width" :visible="modelValue" :ok-loading="loading" @ok="handleOk" @cancel="handleCancel" unmountOnClose>
    <template #title>
      {{ title }}
    </template>
    <pkm-spin dot :loading="loading" class="pkm-w-100">
      <document-form ref="documentForm" :id="id" :type="type" :directory="directory" @info="infoHandler" />
    </pkm-spin>
  </pkm-drawer>
</template>
<script lang="ts">
import { defineComponent, PropType, ref, CSSProperties, watchEffect } from 'vue'
import * as TypesBase from '@/types/base'
import * as TypesDocument from '@/types/document'
import DocumentForm from './form.vue'

export interface DocumentFormDrawerProps {
  modelValue: boolean,
  id: string,
  directory: string[],
  type: TypesBase.IBaseTypesType,
  width: CSSProperties['width']
}

export default defineComponent({
  name: 'DocumentFormDrawer',
  props: {
    modelValue: {
      type: Boolean as PropType<DocumentFormDrawerProps['modelValue']>,
      default: false
    },
    id: {
      type: String as PropType<DocumentFormDrawerProps['id']>,
      default: ''
    },
    directory: {
      type: Array as PropType<DocumentFormDrawerProps['directory']>,
      default: []
    },
    type: {
      type: String as PropType<DocumentFormDrawerProps['type']>,
      default: TypesBase.IBaseTypesType.FILE
    },
    width: {
      type: String as PropType<DocumentFormDrawerProps['width']>,
      default: '420px'
    }
  },
  components: {
    DocumentForm
  },
  emits: ['update:modelValue', 'done'],
  setup (props, ctx) {
    const documentForm = ref()
    const loading = ref(false)

    const title = ref()

    const infoHandler = (data: TypesDocument.IDocumentType) => {
      const _prefix = '编辑'
      const _title = data.type === TypesBase.IBaseTypesType.FILE ? '文档' : '目录'
      title.value = _prefix + _title
    }
    const handleOk = () => {
      loading.value = true
      documentForm.value.submit().then(() => {
        ctx.emit('update:modelValue', false)
        ctx.emit('done')
      }).finally(() => {
        loading.value = false
      })
    }
    const handleCancel = () => {
      ctx.emit('update:modelValue', false)
    }

    watchEffect(() => {
      const _prefix = props.id ? '编辑' : '新建'
      const _title = props.type === TypesBase.IBaseTypesType.FILE ? '文档' : '目录'
      title.value = _prefix + _title
    })

    return {
      title,
      infoHandler,
      documentForm,
      loading,
      handleOk,
      handleCancel
    }
  }
})
</script>
