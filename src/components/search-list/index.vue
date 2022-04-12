<template>
  <div class="search">
    <pkm-input-search :placeholder="placeholder" v-model="keyword" class="pkm-search-input" :loading="loading" :allow-clear="true" @input="searchHandle" @search="searchHandle" @clear="searchClear" @focus="showSearchResult" @blur="searchBlurHandler" />
    <pkm-list size="small" class="search-result" v-if="searchResultVisible">
      <pkm-list-item v-for="item in searchResult" :key="item._id" @click="searchResultClickHandler(item)">
        <div class="title" v-html="replaceHtml(item.title)"></div>
        <div class="desc" v-html="replaceHtml(item.desc)"></div>
      </pkm-list-item>
    </pkm-list>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import { BookSearch } from '../../apis/book'
import { DocumentSearch } from '../../apis/document'
export interface ListItemType {
  _id: string,
  title: string,
  desc: string,
  cover: string,
  parents?: string[]
  top?: boolean,
  author?: string
}
export interface SearchListType {
  type: string,
  placeholder: string
}
export default defineComponent({
  props: {
    type: {
      type: String as PropType<SearchListType['type']>,
      require: true
    },
    placeholder: {
      type: String as PropType<SearchListType['placeholder']>,
      default: '输入关键词搜索'
    },
    conditions: {
      type: [Object, Array],
      default: null
    }
  },
  setup (props, ctx) {
    const keyword = ref('')
    const loading = ref(false)
    const searchResultVisible = ref(false)
    const searchResult = ref<ListItemType[]>([])
    const replaceHtml = (str: string) => {
      return str.replace(new RegExp(keyword.value, 'gmi'), `<em>${keyword.value}</em>`)
    }
    const showSearchResult = () => {
      searchResultVisible.value = true
    }
    const hideSearchResult = () => {
      searchResultVisible.value = false
    }
    const searchBlurHandler = () => {
      if (!keyword.value) {
        searchResultVisible.value = false
      }
    }
    const searchHandle = () => {
      if (keyword.value) {
        loading.value = true
        const conditions = props.conditions as string[]
        const action = props.type === 'book' ? BookSearch(keyword.value) : DocumentSearch(keyword.value, conditions)
        action.then(res => {
          searchResult.value = res.data || []
        }).catch(_ => {
          searchResult.value = []
        }).finally(() => {
          loading.value = false
        })
      }
    }
    const searchClear = () => {
      hideSearchResult()
    }
    const searchResultClickHandler = (item: ListItemType) => {
      keyword.value = ''
      hideSearchResult()
      ctx.emit('itemClick', item)
    }
    return {
      keyword,
      loading,
      searchResultVisible,
      searchResult,
      replaceHtml,
      showSearchResult,
      hideSearchResult,
      searchBlurHandler,
      searchHandle,
      searchClear,
      searchResultClickHandler
    }
  }
})
</script>
