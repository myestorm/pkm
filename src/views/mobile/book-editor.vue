<template>
  <mobile-layout title="书架" subtitle="祖国富强民主，八荣八耻" :footer="false" class="editor-page">
      <template #main>
        <div class="book-form">
          <book-form ref="formRef" v-model:loading="loading" />
          <div class="fixed-button">
            <pkm-button type="primary" :loading="loading" long @click="submit">保存数据</pkm-button>
          </div>
        </div>
      </template>
  </mobile-layout>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'

import MobileLayout from '../../components/layout/mobile-layout.vue'
import BookForm from '../../components/book-form/index.vue'


export default defineComponent({
  components: {
    MobileLayout,
    BookForm
  },
  setup () {
    const formRef = ref<null | InstanceType<typeof BookForm>>(null)
    const loading = ref(false)
    return {
      formRef,
      loading,
      submit () {
        formRef.value?.save()
      }
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
