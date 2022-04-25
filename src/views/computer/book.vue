<template>
  <pkm-layout class="pkm-file-layout">
    <book-side-list ref="bookSideList" />
    <book-form-drawer width="420px" ref="" :id="bookFormDrawerId" :type="bookFormDrawerType" :directory="directory" v-model="bookFormDrawerVisible" @done="drawerDone" />
    <pkm-layout-content>
      <div class="view" v-if="id">
        <book-info ref="bookInfo" :id="id" @edit="editHandler" @ready="readyHandler" />
      </div>
    </pkm-layout-content>
  </pkm-layout>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

import BookFormDrawer from '@/components/pkm-book/form-drawer.vue'
import BookSideList from './book/side-list.vue'
import BookInfo from './book/info.vue'

import * as TypesBook from '@/types/book'
import useBookStore from '@/store/modules/book/index'

export default defineComponent({
  components: {
    BookFormDrawer,
    BookSideList,
    BookInfo
  },
  setup () {
    const route = useRoute()
    const { id } = route.params as { id: string }
    const bookStore = useBookStore()
    const { currentId, directory, bookFormDrawerId, bookFormDrawerType, bookFormDrawerVisible } = storeToRefs(bookStore)
    const bookSideList = ref()
    const bookInfo = ref()

    const drawerDone = () => {
      bookSideList.value.getList()
      bookInfo.value.getInfo(id)
    }

    const editHandler = () => {
      bookStore.edit(id)
    }

    const readyHandler = (data: TypesBook.IBookType) => {
      directory.value = [...data.directory]
    }

    currentId.value = id

    return {
      id,
      bookSideList,
      bookInfo,

      currentId,
      directory,
      bookFormDrawerId,
      bookFormDrawerType,
      bookFormDrawerVisible,
      drawerDone,

      editHandler,
      readyHandler
    }
  }
})
</script>
<style lang="scss" scoped>
.view {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 16px 32px;
  background-color: var(--color-bg-3);
}
</style>
