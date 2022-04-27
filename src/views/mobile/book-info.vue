<template>
  <mobile-layout title="书架" :subtitle="title" :footer="false">
      <template #main>
        <book-info :id="id" @edit="editBook" @getInfo="getInfo" />
      </template>
  </mobile-layout>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import MobileLayout from '../../components/layout/mobile-layout.vue'
import BookInfo from './book/info.vue'
import * as TypesBook from '@/types/book'

export default defineComponent({
  components: {
    MobileLayout,
    BookInfo
  },
  setup () {
    const router = useRouter()
    const route = useRoute()
    const id = (route.params.id || '') as string
    const title = ref('')
    const getInfo = (item: TypesBook.IBookType) => {
      title.value = item.title
    }
    const editBook = (item: TypesBook.IBookType) => {
      router.push(`/m/book/editor/${item._id}`)
    }
    return {
      id,
      title,
      getInfo,
      editBook
    }
  },
})
</script>
<style lang="scss" scoped>
.book-info {
  width: 100%;
  color: var(--color-text-1);
  text-align: justify;
  h1 {
    @include reset();
  }
  dl {
    @include reset();
    display: flex;
    align-items: center;
  }
  .desc {
    display: flex;
    align-items: flex-start;
  }
  img {
    width: 80px;
    border: 1px solid var(--color-neutral-3);
    margin-right: 20px;
    display: inline-block;
  }
}
.notes {
  padding-right: 54px;
  .btn {
    position: fixed;
    right: 0;
    bottom: 0;
    padding: 16px;
  }
}
.pkm-timeline-item {
  position: relative;
  padding-bottom: 16px;
  text-align: justify;
  :deep(p) {
    margin: 0;
    padding: 0;
  }
  .action {
    position: absolute;
    right: 0;
    bottom: 0;
  }
}
.markdown-editor {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: absolute;
  left: 0;
  top: 0;
  overflow: hidden;
}
</style>
<style lang="scss">
.editor-drawer {
  .arco-drawer-body {
    width: 100%;
    padding: 0;
    margin: 0;
  }
}
</style>
