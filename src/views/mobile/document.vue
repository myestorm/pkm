<template>
  <mobile-layout title="文档" :subtitle="pageTitle" :back="pageBack">
    <template #main>
      <div class="pkm-mobile-file-list">
        <pkm-space direction="vertical" fill>
          <pkm-breadcrumb :max-count="4">
            <pkm-breadcrumb-item><router-link to="/m/document"><icon-home /></router-link></pkm-breadcrumb-item>
            <pkm-breadcrumb-item v-for="(item, index) in directoryList" :key="item._id" @click="breadcrumbClickEvent(item, index)">{{ item.title }}</pkm-breadcrumb-item>
            <template #separator>
              <icon-right />
            </template>
          </pkm-breadcrumb>
          <div class="pkm-totonoo-search">
            <pkm-input-search placeholder="搜索当前文档" v-model="keyword" class="search-input" :loading="searchLoading" :allow-clear="true" @input="searchHandler" @search="searchHandler" @clear="searchClearHandler" />
          </div>
          <div class="content">
            <div class="file-list">
              <ul v-if="list.length > 0">
                <li class="item" v-for="item in list" :key="item._id">
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
                        <pkm-doption @click="edit(item)">
                          <template #icon>
                            <icon-edit />
                          </template>
                          编辑
                        </pkm-doption>
                        <pkm-doption @click="remove(item._id)">
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
        <document-form-drawer width="100%" :id="documentFormDrawerId" :type="documentFormDrawerType" :directory="directory" v-model="documentFormDrawerVisible" @done="drawerDone" />
      </div>
    </template>
  </mobile-layout>
</template>
<script lang="ts">
import { defineComponent, ref, getCurrentInstance, compu } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import MobileLayout from '@/components/layout/mobile-layout.vue'
import DocumentFormDrawer from '@/components/pkm-document/form-drawer.vue'

import useDocumentStore from '@/store/modules/document/index'
import * as TypesBase from '@/types/base'
import * as TypesDocument from '@/types/document'

export default defineComponent({
  components: {
    MobileLayout,
    DocumentFormDrawer
  },
  setup () {
    const app = getCurrentInstance()
    const msg = app?.appContext.config.globalProperties.$message
    const modal = app?.appContext.config.globalProperties.$modal
    const dayjs = app?.appContext.config.globalProperties.$dayjs
    const router = useRouter()
    const route = useRoute()
    const documentStore = useDocumentStore()
    const { directory, directoryList, documentFormDrawerId, documentFormDrawerType, documentFormDrawerVisible } = storeToRefs(documentStore)

    const pageTitle = ref('')
    const keyword = ref('')
    const searchLoading = ref(false)
    const addBtns = ref(false)

    const list = ref<TypesDocument.IDocumentType[]>([])

    const mergeDirectory = (item: TypesDocument.IDocumentType): string => {
      const _directory = [...item.directory]
      _directory.push(item.id)
      return _directory.join('/')
    }

    const breadcrumbClickEvent = (item: TypesBase.IBaseDirectoryListItemType, index: number) => {
      const _directory = mergeDirectory(item)
      const _directoryList = directoryList.value.slice(0, index + 1)

      directoryList.value = [..._directoryList]
      router.push(`/m/document/${_directory}`)
    }

    const creatDocument = () => {
      documentStore.create(TypesBase.IBaseTypesType.FILE)
    }
    const creatFolder = () => {
      documentStore.create(TypesBase.IBaseTypesType.FOLDER)
    }
    const edit = (item: TypesDocument.IDocumentType) => {
      documentStore.edit(item._id)
    }
    const remove = (id: string) => {
      modal.open({
        title: '系统提示',
        content: `该操作会删除内容，是否继续？`,
        hideCancel: false,
        simple: true,
        modalClass: ['pkm-modal-simple'],
        onOk () {
          documentStore.docRemove(id).then(_ => {
            getList()
          }).catch(err => {
            msg.error(err.message)
          })
        }
      })
    }
    const getList = () => {
      documentStore.docList({
        directory: [...directory.value]
      }).then(res => {
        list.value = res.data || []
      }).catch(err => {
        msg.error(err.message)
      })
    }
    const drawerDone = () => {
      getList()
    }

    let searchTimer: number
    const searchHandler = () => {
      if (searchTimer) {
        window.clearTimeout(searchTimer)
      }
      if (searchLoading.value || !keyword.value) {
        return
      }
      searchTimer = window.setTimeout(() => {
        searchLoading.value = true
        documentStore.docSearch(keyword.value, [...directory.value]).then(res => {
          list.value = res.data || []
        }).catch(_ => {
          list.value = []
        }).finally(() => {
          searchLoading.value = false
        })
      }, 300)
    }
    const searchClearHandler = () => {
      getList()
    }

    const itemClickHandler = (item: TypesDocument.IDocumentType) => {
      const _directory = [...item.directory]
      if (item.type === TypesBase.IBaseTypesType.FILE) {
        router.push(`/m/document/editor/${item._id}`)
      } else {
        const __directory = mergeDirectory(item)
        const __directoryList = [...item.directoryList]
        __directoryList.push(item)
        directoryList.value = [...__directoryList]
        router.push(`/m/document/${__directory}`)
      }
    }

    const getInfo = (id: string) => {
      documentStore.docInfo(id).then(res => {
        const data = res.data
        if (data) {
          pageTitle.value = data.title || '所有文档的列表'
          const _directoryList = data.directoryList || []
          _directoryList.push(data)
          directoryList.value = [..._directoryList]
        }
      }).catch(err => {
        msg.error(err.message)
      })
    }

    if (route.params.path) {
      directory.value = [...route.params.path]
      const _lastId = directory.value[directory.value.length - 1]
      getInfo(_lastId)
    } else {
      pageTitle.value = '所有文档列表'
      directory.value = []
      directoryList.value = []
    }
    getList()

    const pageBack = () => {
      if (directory.value && directory.value.length > 0) {
        router.back()
      } else {
        router.push('/m/home')
      }
    }

    return {
      pageTitle,
      directoryList,
      keyword,
      searchLoading,
      searchHandler,
      searchClearHandler,
      mergeDirectory,
      breadcrumbClickEvent,

      list,
      itemClickHandler,

      documentFormDrawerId,
      documentFormDrawerType,
      documentFormDrawerVisible,
      drawerDone,
      creatDocument,
      creatFolder,
      edit,
      remove,
      directory,

      pageBack,
      
      addBtns,
      dayjs
    }
  }
})
</script>
