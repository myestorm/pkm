<template>
  <pkm-drawer width="100%" :visible="modelValue" :ok-loading="loading" @ok="submit" @cancel="handleCancel" unmountOnClose>
    <template #title>
      书籍
    </template>
    <div>
      <book-form ref="formRef" :id="id" v-model:loading="loading" @info="infoHandler" @success="successHandler" />
    </div>
  </pkm-drawer>
</template>
<script lang="ts">
import { defineComponent, ref, PropType } from 'vue'

import BookForm from './index.vue'

import { IBookDataFormType } from '../../../types/book'

export interface BookFormDrawerProps {
  modelValue: boolean,
  id: string
}

export default defineComponent({
  components: {
    BookForm
  },
  props: {
    modelValue: {
      type: Boolean as PropType<BookFormDrawerProps['modelValue']>,
      default: false
    },
    id: {
      type: String as PropType<BookFormDrawerProps['id']>,
      default: ''
    }
  },
  emits: ['update:modelValue', 'success'],
  setup (props, ctx) {
    const formRef = ref<null | InstanceType<typeof BookForm>>(null)
    const loading = ref(false)
    const title = ref('添加书籍')
    const infoHandler = (data: IBookDataFormType) => {
      title.value = data.title || '添加书籍'
    }
    const submit = () => {
      formRef.value?.save()
    }
    const successHandler = () => {
      ctx.emit('update:modelValue', false)
      ctx.emit('success')
    }
    const handleCancel = () => {
      ctx.emit('update:modelValue', false)
    }
    return {
      formRef,
      loading,
      title,
      infoHandler,
      submit,
      successHandler,
      handleCancel
    }
  },
})
</script>
<style lang="scss" scoped>
.book-form {
  padding-bottom: 64px;
  .fixed-button {
    width: 100%;
    position: fixed;
    left: 0;
    bottom: 0;
    box-sizing: border-box;
    padding: 16px;
    background-color: var(--my-app-bg);
  }
}
</style>
