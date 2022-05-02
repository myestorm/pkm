<template>
  <mobile-layout title="首页" subtitle="移动版入口">
    <template #header>
      <div class="pkm-totonoo-flex header">
        <div class="pkm-totonoo-auto-complete-search" flex="auto">
          <pkm-trigger trigger="focus" popup-container=".pkm-totonoo-auto-complete-search" class="pkm-trigger">
            <pkm-input-search
              v-model="keyword"
              :allow-clear="true"
              :loading="searchLoading"
              @input="searchHandler"
              @search="searchHandler"
              class="search-input"
              placeholder="输入关键词搜索"
            />
            <template #content>
              <div class="search-result">
                <pkm-card title="文档" size="small" :bordered="false" v-if="searchList.documents.length > 0">
                  <ul>
                    <li v-for="item in searchList.documents" :key="item.id" @click="linkTo('document', item)">{{ item.title }}</li>
                  </ul>
                </pkm-card>
                <pkm-card title="书架" size="small" :bordered="false" v-if="searchList.books.length > 0">
                  <ul>
                    <li v-for="item in searchList.books" :key="item.id" @click="linkTo('book', item)">{{ item.title }}</li>
                  </ul>
                </pkm-card>
                <pkm-empty v-if="searchList.documents.length == 0 && searchList.books.length == 0">
                  <template #image>
                    <icon-empty size="32" :strokeWidth="2" />
                  </template>
                  没有相关数据
                </pkm-empty>
              </div>
            </template>
          </pkm-trigger>
        </div>
        <pkm-button class="scan-btn">
          <template #icon>
            <icon-scan />
          </template>
        </pkm-button>
      </div>
    </template>
    <template #main>
      <pkm-space direction="vertical" size="medium" fill>
        <pkm-card title="最近文档" class="pkm-totonoo-card">
          <div class="item" v-for="item in documentList" :key="item.id" @click="linkTo('document', item)">
            <div class="name"><icon-file style="margin-right: 4px;" />{{ item.title }}</div>
            <div class="desc">{{ subStr(item.desc, 84) }}</div>
            <div class="day">{{ dayjs(item.updatedAt).format('YYYY-MM-DD HH:mm') }}</div>
          </div>
        </pkm-card>
        <pkm-card title="书架更新" class="pkm-totonoo-card">
          <pkm-row :gutter="[8, 8]">
            <pkm-col :span="8" v-for="item in bookList" :key="item.id" @click="linkTo('book', item)">
              <div class="item-box">
                <pkm-image :alt="item.title" :src="item.cover || '/images/no-book.png'" width="100%" />
                <div class="book-title" :title="item.title">{{ subStr(item.title, 12) }}</div>
              </div>
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
import MobileLayout from '@/components/layout/mobile-layout.vue'
import * as TypesBase from '@/types/base'
import useStore from '@/store/index'

import { subStr } from '@/utils/index'

export default defineComponent({
  components: {
    MobileLayout
  },
  setup () {
    const app = getCurrentInstance()
    const dayjs = app?.appContext.config.globalProperties.$dayjs
    const router = useRouter()
    const store = useStore()

    const documentList = ref<TypesBase.IBaseFieldsType[]>([])
    const bookList = ref<TypesBase.IBaseFieldsType[]>([])
    const searchList = ref<TypesBase.ISearchAllDataType>({
      documents: [],
      books: []
    })
    const searchLoading = ref(false)
    const keyword = ref('')
    const searchHandler = () => {
      if (searchLoading.value) {
        return
      }
      if (keyword.value) {
        searchLoading.value = true
        store.searchAll(keyword.value).then(res => {
          searchList.value.documents = res.data.documents || []
          searchList.value.books = res.data.books || []
        }).catch(_ => {
          searchList.value.documents = []
          searchList.value.books = []
        }).finally(() => {
          searchLoading.value = false
        })
      } else {
        searchList.value.documents = []
        searchList.value.books = []
      }
    }
    const linkTo = (type: string, item: TypesBase.IBaseFieldsType) => {
      const urls = [...item.directory]
      urls.push(item.id)
      router.push(`/m/${type}/${urls.join('/')}`)
    }
    store.recent().then(res => {
      documentList.value = res.data.documents || []
      bookList.value = res.data.books || []
    }).catch(_ => {
      documentList.value = []
      bookList.value = []
    })
    return {
      documentList,
      bookList,
      searchList,
      searchLoading,
      keyword,
      searchHandler,
      linkTo,
      dayjs,
      subStr
    }
  }
})
</script>
<style lang="scss" scoped>
.header {
  padding: 12px 12px 6px;
  .scan-btn {
    margin-left: 8px;
  }
}
</style>
