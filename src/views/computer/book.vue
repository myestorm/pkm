<template>
  <pkm-layout class="pkm-file-layout">
    <book-side-list ref="bookSideList" />
    <book-form-drawer width="420px" :id="bookFormDrawerId" :type="bookFormDrawerType" :directory="directory" v-model="bookFormDrawerVisible" @done="drawerDone" />
    <pkm-layout-content>
      <!-- <book-info :id="id" /> -->
    </pkm-layout-content>
  </pkm-layout>
</template>
<script lang="ts">
import { defineComponent, ref, getCurrentInstance } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

import BookFormDrawer from '@/components/pkm-book/form-drawer.vue'
import BookSideList from './book/side-list.vue'
import BookInfo from './book/info.vue'

import useBookStore from '@/store/modules/book/index'
import * as TypesBase from '@/types/base'
import * as TypesDocument from '@/types/document'

export default defineComponent({
  components: {
    BookFormDrawer,
    BookSideList,
    BookInfo
  },
  setup () {
    const router = useRouter()
    const route = useRoute()
    const { id } = route.params as { id: string }
    const bookStore = useBookStore()
    const { currentId, directory, bookFormDrawerId, bookFormDrawerType, bookFormDrawerVisible } = storeToRefs(bookStore)
    const bookSideList = ref()

    const drawerDone = () => {
      bookSideList.value.getList()
    }

    return {
      id,
      bookSideList,

      currentId,
      directory,
      bookFormDrawerId,
      bookFormDrawerType,
      bookFormDrawerVisible,
      drawerDone
    }
  }
})
</script>
<style lang="scss" scoped>
.#{$--prefix}-file-layout {
  width: 100%;
  height: 100%;
}
</style>
