<template>
  <pkm-layout class="layout-app">
    <pkm-layout-sider class="aside">
      <pkm-layout class="home-side-bar">
        <pkm-layout-header>
          <pkm-input-search :style="{width:'100%', height: `${hh}px`}" placeholder="输入关键字搜索" v-model="keyword" allow-clear :loading="loading" @change="search"  @input="search" />
        </pkm-layout-header>
        <pkm-layout-content>
          <pkm-list :max-height="vh - hh" :bordered="false" @reach-bottom="reachBottom" class="pkm-list">
            <pkm-list-item-meta
              v-for="(item, index) in list"
              class="pkm-list-item"
              :key="item.id"
              :class="[index === 0 ? 'current' : '']"
              :title="item.title"
              :description="item.desc"
              @click="getDetail(item.id)"></pkm-list-item-meta>
          </pkm-list>
        </pkm-layout-content>
      </pkm-layout>
    </pkm-layout-sider>
    <pkm-layout-content>
      <markdown-editor v-model:value="value" @infoClick="infoHandleClick">
        <template #info>
          <pkm-drawer :width="600" :visible="infoVisible" @ok="infoHandleOk" @cancel="infoHandleCancel" unmountOnClose>
            <template #title>
              文档信息
            </template>
            <pkm-form ref="formRef" :model="form" label-align="left">
              <pkm-form-item field="name" label="文档名称" :rules="rules">
                <pkm-input v-model="form.name" placeholder="please enter your username..." />
              </pkm-form-item>
              <pkm-form-item field="name" label="所属目录" :rules="rules">
                <pkm-input v-model="form.name" placeholder="please enter your username..." />
              </pkm-form-item>
              <pkm-form-item field="name" label="文档简介" :rules="rules">
                <pkm-input v-model="form.name" placeholder="please enter your username..." />
              </pkm-form-item>
              <pkm-form-item field="name" label="文档标签" :rules="rules">
                <pkm-input v-model="form.name" placeholder="please enter your username..." />
              </pkm-form-item>
              <pkm-form-item field="post" label="封面图片">
                <pkm-input v-model="form.post" placeholder="please enter your post..." />
              </pkm-form-item>
              <pkm-form-item field="post" label="发布时间">
                <pkm-input v-model="form.post" placeholder="please enter your post..." />
              </pkm-form-item>
              <pkm-form-item field="isRead">
                <pkm-checkbox v-model="form.isRead">
                前台是否可见
                </pkm-checkbox>
              </pkm-form-item>
            </pkm-form>
          </pkm-drawer>
        </template>
      </markdown-editor>
    </pkm-layout-content>
  </pkm-layout>
</template>
<script lang="ts">
import '../assets/scss/app.scss'
import { ref } from 'vue'
import MarkdownEditor from '../components/editor/markdown-editor.vue'
import { ApiDocuments, ApiDocumentId } from '../apis/index'
import { IDocumentListItemType, IDocumentListQueryType } from '../../app/types/document'

export default {
  name: 'Home',
  components: {
    MarkdownEditor
  },
  setup () {
    const page = ref(1)
    const pagesize = ref(10)
    const isLast = ref(false)
    const list = ref<IDocumentListItemType[]>([])
    const value = ref('')
    const loading = ref(false)
    const keyword = ref('')
    const infoVisible = ref(true)

    let searchTimer: number | null = null

    const getList = (params: IDocumentListQueryType) => {
      ApiDocuments(params).then(res => {
        if (list.value.length > 0) {
          list.value = [
            ...list.value,
            ... res.data.list
          ]
        } else {
          list.value = res.data.list
        }
        isLast.value = (res.data.page * res.data.pagesize) >= res.data.total
        page.value = Number(res.data.page)
        pagesize.value = Number(res.data.pagesize)
      }).finally(() => {
        loading.value = false
      })
    }
    const reachBottom = () => {
      if (!isLast.value) {
        getList({
          page: page.value + 1,
          pagesize: pagesize.value,
          keyword: keyword.value
        })
      }
    }
    getList({
      page: page.value, 
      pagesize: pagesize.value,
      keyword: keyword.value
    })

    const getDetail = (id: number) => {
      ApiDocumentId(id).then(res => {
        value.value = res.data.content
      })
    }

    const search = () => {
      loading.value = true
      if (searchTimer) {
        window.clearTimeout(searchTimer)
      }
      searchTimer = window.setTimeout(() => {
        list.value = []
        getList({
          page: 1, 
          pagesize: pagesize.value,
          keyword: keyword.value
        })
      }, 500)
    }
    
    const hh = 48
    const vh = document.body.clientHeight
    
    
    let data = ref([])
    return {
      list,
      hh,
      vh,
      loading,
      keyword,
      value,
      data,
      getDetail,
      search,
      reachBottom,
      infoVisible,
      form: {
        name: '',
        post: '',
        isRead: false,
      },
      rules: [],
      infoHandleClick () {
        infoVisible.value = true
      },
      infoHandleOk () {},
      infoHandleCancel () {},
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
