<template>
  <pkm-drawer :width="width" :visible="modelValue" :ok-loading="loading" @ok="handleOk" @cancel="handleCancel" unmountOnClose>
    <template #title>
      {{ title }}
    </template>
    <pkm-spin dot :loading="loading" class="pkm-totonoo-w-100">
      <document-form ref="bookForm" :id="id" :type="type" :directory="directory" @ready="readyHandler" />
    </pkm-spin>
  </pkm-drawer>
</template>
<script lang="ts">
import { defineComponent, PropType, ref, CSSProperties, watchEffect } from 'vue'
import * as TypesBase from '@/types/base'
import * as TypesBook from '@/types/book'
import DocumentForm from './form.vue'

export interface BookFormDrawerProps {
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
      type: Boolean as PropType<BookFormDrawerProps['modelValue']>,
      default: false
    },
    id: {
      type: String as PropType<BookFormDrawerProps['id']>,
      default: ''
    },
    directory: {
      type: Array as PropType<BookFormDrawerProps['directory']>,
      default: []
    },
    type: {
      type: String as PropType<BookFormDrawerProps['type']>,
      default: TypesBase.IBaseTypesType.FILE
    },
    width: {
      type: String as PropType<BookFormDrawerProps['width']>,
      default: '420px'
    }
  },
  components: {
    DocumentForm
  },
  emits: ['update:modelValue', 'done'],
  setup (props, ctx) {
    const bookForm = ref()
    const loading = ref(false)

    const title = ref()

    const changeTitle = (type: TypesBase.IBaseTypesType, prefix: string) => {
      const _title = type === TypesBase.IBaseTypesType.FILE ? '书籍' : '目录'
      title.value = prefix + _title
    }

    const readyHandler = (data: TypesBook.IBookType) => {
      changeTitle(data.type, '编辑')
    }
    const handleOk = () => {
      loading.value = true
      bookForm.value.submit().then(() => {
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
      changeTitle(props.type, _prefix)
    })

    return {
      title,
      readyHandler,
      bookForm,
      loading,
      handleOk,
      handleCancel
    }
  }
})
</script>
