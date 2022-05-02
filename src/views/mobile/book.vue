<template>
  <mobile-layout title="书架" :subtitle="pageTitle" :back="pageBack">
    <template #main>
      <div class="pkm-totonoo-mobile-file-list">
        <pkm-space direction="vertical" fill>
          <pkm-breadcrumb :max-count="4">
            <pkm-breadcrumb-item><router-link to="/m/book"><icon-home /></router-link></pkm-breadcrumb-item>
            <pkm-breadcrumb-item v-for="item in breadcrumbs" :key="item.url">
              <router-link :to="`/m/book/${item.url}`">{{ item.title }}</router-link>
            </pkm-breadcrumb-item>
            <template #separator>
              <icon-right />
            </template>
          </pkm-breadcrumb>
          <div class="pkm-totonoo-auto-complete-search">
            <pkm-trigger trigger="focus" popup-container=".pkm-totonoo-auto-complete-search" class="pkm-trigger">
              <pkm-input-search
                v-model="keyword"
                :allow-clear="true"
                :loading="searchLoading"
                @input="searchHandler"
                @search="searchHandler"
                @clear="searchClear"
                class="search-input"
                placeholder="输入关键词搜索文档"
              />
              <template #content>
                <div class="search-result">
                  <ul class="singal">
                    <li v-for="item in searchList" :key="item.id" @click="linkTo(item)">{{ item.title }}</li>
                  </ul>
                  <pkm-empty v-if="searchList.length == 0">
                    <template #image>
                      <icon-empty size="32" :strokeWidth="2" />
                    </template>
                    没有相关数据
                  </pkm-empty>
                </div>
              </template>
            </pkm-trigger>
          </div>
          <div class="content">
            <div class="file-list">
              <ul v-if="list.length > 0">
                <li class="item" :class="[item.id == currentId ? 'current' : '']" v-for="item in list" :key="item.id">
                  <div class="icon" @click="itemClickHandler(item)">
                    <icon-file :size="24" :strokeWidth="2" v-if="item.type == 'file'" />
                    <icon-folder :size="24" :strokeWidth="2" v-else />
                  </div>
                  <div class="info" @click="itemClickHandler(item)">
                    <div class="title">{{ item.title }}</div>
                    <div class="desc">{{ item.desc }}</div>
                    <div class="day">
                      {{ dayjs(item.updatedAt).format('YYYY-MM-DD HH:mm') }}
                    </div>
                  </div>
                  <div class="action">
                    <pkm-dropdown position="br">
                      <pkm-button-group>
                        <pkm-button type="text" class="btn-info">
                          <template #icon>
                            <icon-more />
                          </template>
                        </pkm-button>
                      </pkm-button-group>
                      <template #content>
                        <pkm-doption @click="editHandler(item.id)">
                          <template #icon>
                            <icon-edit />
                          </template>
                          编辑
                        </pkm-doption>
                        <pkm-doption @click="removeHandler(item.id)">
                          <template #icon>
                            <icon-delete />
                          </template>
                          删除
                        </pkm-doption>
                      </template>
                    </pkm-dropdown>
                  </div>
                </li>
              </ul>
              <pkm-empty v-else />
            </div>
          </div>
        </pkm-space>
        <pkm-space class="fix-btn" direction="vertical" fill>
          <pkm-space direction="vertical" fill v-show="addBtns">
            <pkm-button type="primary" status="success" shape="circle" size="large" @click="creatFolder"><icon-folder /></pkm-button>
            <pkm-button type="primary" status="warning" shape="circle" size="large" @click="creatDocument"><icon-file /></pkm-button>
          </pkm-space>
          <pkm-button type="primary" shape="circle" size="large" @click="addBtns = !addBtns">
            <icon-plus />
          </pkm-button>
        </pkm-space>
        <form-drawer width="100%" v-model="formDrawerVisible" :type="formDrawerType" :id="formDrawerId" :directory="formDrawerDirectory" @done="formDrawerDone" />
      </div>
      <pkm-drawer width="100%" class="pkm-totonoo-editor-drawer" :visible="infoDrawerVisible" :footer="false" @cancel="infoDrawerHide" unmountOnClose>
        <template #title>
          {{ pageInfo.title }} - {{ pageInfo.author }}
        </template>
        <book-info v-if="pageInfo.id != ''" :data="pageInfo" @update="bookInfoUpdateHandler" />
      </pkm-drawer>
    </template>
  </mobile-layout>
</template>
<script lang="ts">
import { defineComponent, ref, getCurrentInstance, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import MobileLayout from '@/components/layout/mobile-layout.vue'
import FormDrawer from '@/views/components/book/form-drawer.vue'
import BookInfo from '@/views/components/book/info-mobile.vue'

import useBookStore from '@/store/book/index'
import * as TypesBase from '@/types/base'
import * as TypesBook from '@/types/book'

export default defineComponent({
  components: {
    MobileLayout,
    FormDrawer,
    BookInfo
  },
  setup () {
    const app = getCurrentInstance()
    const msg = app?.appContext.config.globalProperties.$message
    const modal = app?.appContext.config.globalProperties.$modal
    const dayjs = app?.appContext.config.globalProperties.$dayjs
    const router = useRouter()
    const route = useRoute()
    const bookStore = useBookStore()

    const pageTitle = ref('')
    const addBtns = ref(false)

    const paths = ref<string[]>((route.params.path || []) as string[])
    const currentId = ref<string>(paths.value[paths.value.length - 1] || '')
    const pageInfo = ref<TypesBook.IBookType>({
      ...bookStore.getBookDefault
    })

    const loading = ref(false)
    const list = ref<TypesBook.IBookType[]>([])
    const breadcrumbs = ref<TypesBase.INavigationType[]>([])
    const getList = () => {
      loading.value = true
      bookStore.bookList({
        directory: paths.value
      }).then(res => {
        list.value = res.data
      }).catch(_ => {
        list.value = []
      }).finally(() => {
        loading.value = false
      })
    }
    

    const infoDrawerVisible = ref(false)
    const infoDrawerHide = () => {
      infoDrawerVisible.value = false
    }
    const showEditorDrawer = (item: TypesBook.IBookType) => {
      infoDrawerVisible.value = true
    }
    const updatePageInfo = () => {
      if (currentId.value === pageInfo.value.id) {
        bookStore.bookInfo(pageInfo.value.id).then(res => {
          const data = res.data
          const type = data.type
          if (type === TypesBase.IBaseTypesType.FILE) {
            pageInfo.value = {
              ...data
            }
          }
        }).catch(err => {
          msg.error(err.message)
        })
      }
    }
    const bookInfoUpdateHandler = () => {
      updatePageInfo()
    }

    const linkDocument = (_paths: string[]) => {
      router.push(`/m/book/${_paths.join('/')}`)
    }
    const itemClickHandler = (item: TypesBook.IBookType) => {
      const _directory = [...item.directory]
      const _id = item.id
      _directory.push(_id)
      linkDocument(_directory)
      if (item.id === currentId.value && item.type === TypesBase.IBaseTypesType.FILE) {
        showEditorDrawer(item)
      }
    }
    const editHandler = (id: string) => {
      formDrawerId.value = id
      formDrawerVisible.value = true
    }
    const removeHandler = (id: string) => {
      modal.open({
        title: '系统提示',
        content: `该操作会删除内容，是否继续？`,
        hideCancel: false,
        simple: true,
        modalClass: ['pkm-totonoo-modal-simple'],
        onOk () {
          bookStore.bookRemove(id).then(_ => {
            getList()
          }).catch(err => {
            msg.error(err.message)
          })
        }
      })
    }
    const addBtnChangeHandler = (val: TypesBase.IBaseTypesType) => {
      formDrawerType.value = val
      formDrawerId.value = ''
      formDrawerVisible.value = true
    }
    const creatDocument = () => {
      addBtnChangeHandler(TypesBase.IBaseTypesType.FILE)
    }
    const creatFolder = () => {
      addBtnChangeHandler(TypesBase.IBaseTypesType.FOLDER)
    }

    const pageBack = () => {
      router.push('/m/home')
    }

    const searchList = ref<TypesBook.IBookType[]>([])
    const searchLoading = ref(false)
    const keyword = ref('')
    const searchHandler = () => {
      if (searchLoading.value) {
        return
      }
      if (keyword.value) {
        const conditions = [...paths.value]
        searchLoading.value = true
        bookStore.bookSearch(keyword.value, conditions).then(res => {
          searchList.value = res.data || []
        }).catch(_ => {
          searchList.value = []
        }).finally(() => {
          searchLoading.value = false
        })
      } else {
        searchList.value = []
      }
    }
    const searchClear = () => {
      searchList.value = []
    }
    const linkTo = (item: TypesBase.IBaseFieldsType) => {
      const urls = [...item.directory]
      urls.push(item.id)
      router.push(`/m/book/${urls.join('/')}`)
    }

    const formDrawerVisible = ref(false)
    const formDrawerType = ref(TypesBase.IBaseTypesType.FILE)
    const formDrawerId= ref()
    const formDrawerDirectory= ref(paths)
    const formDrawerDone = () => {
      getList()
    }

    const mergeBreadcrumbs = (data: TypesBook.IBookType) => {
      const type = data.type
      const _directoryList = [...data.directoryList]
      let _breadcrumbs: TypesBase.INavigationType[] = []
      if (type === TypesBase.IBaseTypesType.FOLDER) {
        _directoryList.push(data)
      }
      _breadcrumbs = _directoryList.map(item => {
        const _directory = [...item.directory]
        _directory.push(item.id)
        const url = _directory.join('/')
        return {
          title: item.title,
          url
        }
      })
      breadcrumbs.value = _breadcrumbs
    }
    const init = () => {
      if (currentId.value) {
        loading.value = true
        bookStore.bookInfo(currentId.value).then(res => {
          const data = res.data
          const type = data.type
          if (type === TypesBase.IBaseTypesType.FILE) {
            paths.value = [...data.directory]
            pageInfo.value = {
              ...data
            }
            showEditorDrawer(data)
          }
          pageTitle.value = data.title || '所有书籍的列表'
          mergeBreadcrumbs(data)
          getList()
        }).catch(err => {
          msg.error(err.message)
        }).finally(() => {
          loading.value = false
        })
      } else {
        breadcrumbs.value = []
        pageTitle.value = '所有书籍的列表'
        getList()
      }
    }
    init()
    watch(
      () => route.params,
      params => {
        const _fullPath = route.fullPath
        if (/^\/document/.test(_fullPath)) {
          const _paths = params.path || []
          paths.value = [..._paths]
          currentId.value = _paths[_paths.length - 1] || ''
          init()
        }
      }
    )

    return {
      pageTitle,
      pageInfo,
      currentId,
      pageBack,

      keyword,
      searchList,
      searchLoading,
      searchHandler,
      searchClear,
      linkTo,

      list,
      breadcrumbs,
      itemClickHandler,
      editHandler,
      removeHandler,

      formDrawerVisible,
      formDrawerType,
      formDrawerId,
      formDrawerDirectory,
      formDrawerDone,

      infoDrawerVisible,
      infoDrawerHide,
      bookInfoUpdateHandler,
      
      addBtns,
      creatDocument,
      creatFolder,

      dayjs
    }
  }
})
</script>
