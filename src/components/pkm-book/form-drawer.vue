<template>
  <pkm-drawer :width="width" :visible="modelValue" :ok-loading="loading" @ok="handleOk" @cancel="handleCancel" unmountOnClose>
    <template #title>
      {{ title }}
    </template>
    <pkm-spin dot :loading="loading" class="pkm-w-100">
      <book-form ref="bookForm" :id="id" :type="type" :directory="directory" @info="infoHandler" />
    </pkm-spin>
  </pkm-drawer>
</template>
<script lang="ts">
import { defineComponent, PropType, ref, CSSProperties, watchEffect } from 'vue'
import * as TypesBase from '@/types/base'
import * as TypesBook from '@/types/book'
import BookForm from './form.vue'

export interface FormDrawerProps {
  modelValue: boolean,
  id: string,
  directory: string[],
  type: TypesBase.IBaseTypesType,
  width: CSSProperties['width']
}

export default defineComponent({
  name: 'BookFormDrawer',
  props: {
    modelValue: {
      type: Boolean as PropType<FormDrawerProps['modelValue']>,
      default: false
    },
    id: {
      type: String as PropType<FormDrawerProps['id']>,
      default: ''
    },
    directory: {
      type: Array as PropType<FormDrawerProps['directory']>,
      default: []
    },
    type: {
      type: String as PropType<FormDrawerProps['type']>,
      default: TypesBase.IBaseTypesType.FILE
    },
    width: {
      type: String as PropType<FormDrawerProps['width']>,
      default: '420px'
    }
  },
  components: {
    BookForm
  },
  emits: ['update:modelValue', 'done'],
  setup (props, ctx) {
    const bookForm = ref()
    const loading = ref(false)

    const title = ref()

    const infoHandler = (data: TypesBook.IBookType) => {
      const _prefix = '编辑'
      const _title = data.type === TypesBase.IBaseTypesType.FILE ? '书籍' : '目录'
      title.value = _prefix + _title
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
      const _title = props.type === TypesBase.IBaseTypesType.FILE ? '书籍' : '目录'
      title.value = _prefix + _title
    })

    return {
      bookForm,
      title,
      infoHandler,
      
      loading,
      handleOk,
      handleCancel
    }
  }
})
</script>
