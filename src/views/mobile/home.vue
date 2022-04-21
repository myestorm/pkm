<template>
  <mobile-layout title="当页面滚动" subtitle="窗口改变">
    <template #header>
      <div class="header">
        <search-list class="search-list" placeholder="" type="document" :conditions="[]" @itemClick="itemClickHandler"></search-list>
        <pkm-button>
          <template #icon>
            <icon-scan />
          </template>
        </pkm-button>
      </div>
    </template>
    <template #main>
      <pkm-space direction="vertical" size="medium" fill>
        <pkm-card title="最近文档" class="pkm-card">
          <div class="item" v-for="item in documentList" :key="item._id" @click="documentInfo(item)">
            <div class="day">{{ dayjs(item.updatedAt).format('YYYY-MM-DD HH:mm') }}</div>
            <div class="name"><icon-file />{{ item.title }}</div>
          </div>
        </pkm-card>
        <pkm-card title="书架更新" class="pkm-card">
          <pkm-row :gutter="[8, 8]">
            <pkm-col :span="8" v-for="item in bookList" :key="item._id" @click="bookInfo(item._id)">
              <pkm-image :src="item.cover || '/images/no-book.png'" width="100%" />
              <div class="book-title">{{ subStr(item.title, 24) }}</div>
            </pkm-col>
          </pkm-row>
        </pkm-card>
      </pkm-space>
    </template>
  </mobile-layout>
</template>
<script lang="ts">
import { defineComponent, ref, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import MobileLayout from '../../components/layout/mobile-layout.vue'
import SearchList, { ListItemType } from '../../components/search-list/index.vue'
import { DocumentListPage } from '../../apis/document'
import * as TypesBase from '../../../types/base'
import * as TypesDocument from '../../../types/document'

import { BookListPage } from '../../apis/book'
import { IBookDataApiType } from '../../../types/book'
import { subStr } from '../../utils/index'

export default defineComponent({
  components: {
    MobileLayout,
    SearchList
  },
  setup () {
    const app = getCurrentInstance()
    const dayjs = app?.appContext.config.globalProperties.$dayjs
    const router = useRouter()

    const documentList = ref<TypesDocument.IDocumentPageListItemType[]>([])
    DocumentListPage({
      page: 1,
      pagesize: 6,
      conditions: {
        type: TypesBase.IBaseTypesType.FILE
      }
    }).then(res => {
      documentList.value = res.data.list || []
    })
    const documentInfo = (item: TypesDocument.IDocumentPageListItemType) => {
      router.push({
        name: 'MobileMrkdown',
        params: {
          parents: item.directory,
          id: item._id
        }
      })
    }
    const itemClickHandler = (item: ListItemType) => {
      router.push({
        name: 'MobileMrkdown',
        params: {
          parents: item.parents,
          id: item._id
        }
      })
    }

    const bookList = ref<IBookDataApiType[]>([])
    BookListPage({
      page: 1,
      pagesize: 9
    }).then(res => {
      bookList.value = res.data.list || []
    })
    const bookInfo = (id: string) => {
      router.push(`/m/book/info/${id}`)
    }
    return {
      documentList,
      documentInfo,
      itemClickHandler,
      bookList,
      bookInfo,
      dayjs,
      subStr
    }
  }
})
</script>
<style lang="scss" scoped>
.header {
  padding: 12px 12px 6px;
  display: flex;
  // align-items: center;
  .search-list {
    flex: 1;
    margin-right: 16px;
  }
}
</style>
