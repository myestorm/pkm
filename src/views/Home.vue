<template>
  <pkm-layout class="layout-app">
    <pkm-layout-sider class="aside">
      <pkm-layout class="home-side-bar">
        <pkm-layout-header>
          <pkm-input-search :style="{width:'100%', height: `${hh}px`}" placeholder="输入关键字搜索" loading />
        </pkm-layout-header>
        <pkm-layout-content>
          <pkm-list :max-height="vh - hh" :bordered="false" @reach-bottom="reachBottom" class="pkm-list">
            <pkm-list-item-meta
              v-for="(item, index) in list"
              :key="item.id"
              class="pkm-list-item"
              :class="[index === 0 ? 'current' : '']"
              :title="item.title"
              :description="item.desc"></pkm-list-item-meta>
          </pkm-list>
        </pkm-layout-content>
      </pkm-layout>
    </pkm-layout-sider>
    <pkm-layout-content>
      <markdown-editor v-model:value="value" />
    </pkm-layout-content>
  </pkm-layout>
</template>
<script lang="ts">
import '../assets/scss/app.scss'
import { ref } from 'vue'
import MarkdownEditor from '../components/editor/markdown-editor.vue'
import { ApiDocuments } from '../apis/index'
import { IDocumentListItemType } from '../../app/types/document'
const _value = ''

export default {
  name: 'Home',
  components: {
    MarkdownEditor
  },
  setup () {
    const list = ref<IDocumentListItemType[]>([])
    ApiDocuments().then(res => {
      list.value = res.data.list
    })
    const hh = 48
    const vh = document.body.clientHeight
    const loading = ref(true)
    const value = ref(_value)
    let data = ref([])
    return {
      list,
      hh,
      vh,
      loading,
      value,
      data,
      reachBottom () {
        console.log(1)
      },
      handleSearch (value: string) {
        // if (value) {
        //   data = [...Array(5)].map((_, index) => `${value}-${index}`)
        // } else {
        //   data = []
        // }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.home-side-bar {
  height: calc(100vh - 2px);
}
.aside {
  width: 280px !important;
}
.pkm-list {
  .pkm-list-item {
    padding: 8px 12px;
    cursor: pointer;
    transition: all 260ms ease;
    border-left: 3px solid transparent;
    border-right: 3px solid transparent;
    &.current {
      border-left-color: $--primary-color;
      background-color: #17171a;
    }
    &:hover {
      background-color: #17171a;
    }
    &:first-child {
      padding-top: 16px;
    }
    &:last-child {
      padding-bottom: 16px;
    }
    .arco-list-item-meta-title {
      font-size: 16px !important;
    }
  }
}
</style>
