<template>
  <mobile-layout title="书架" :subtitle="title" :footer="false" class="editor-page">
      <template #main>
        <div class="book-form">
          <book-form ref="formRef" :id="id" v-model:loading="loading" @info="infoHandler" @success="successHandler" />
          <div class="fixed-button">
            <pkm-button type="primary" :loading="loading" long @click="submit">保存数据</pkm-button>
          </div>
        </div>
      </template>
  </mobile-layout>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import MobileLayout from '../../components/layout/mobile-layout.vue'
import BookForm from '../../components/book-form/index.vue'

import { IBookDataFormType } from '../../../types/book'

export default defineComponent({
  components: {
    MobileLayout,
    BookForm
  },
  setup () {
    const router = useRouter()
    const route = useRoute()
    const id = (route.params.id || '') as string

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
      router.back()
    }
    return {
      id,
      formRef,
      loading,
      title,
      infoHandler,
      submit,
      successHandler
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
