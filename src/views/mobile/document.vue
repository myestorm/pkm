<template>
  <mobile-layout title="文档" :subtitle="pageTitle" :back="pageBack">
    <template #main>
      <div class="pkm-mobile-file-list">
        <pkm-input-search placeholder="搜索当前文档" v-model="keyword" class="pkm-search-input" :loading="loading" :allow-clear="true" @input="searchHandle" @search="searchHandle" @clear="searchClear" @focus="showSearchResult" @blur="searchBlurHandler" />
        <!-- <search-list placeholder="搜索当前文档" type="document" :conditions="filePath" @itemClick="itemClickHandler"></search-list> -->
        <!-- <div class="filter"></div> -->
        <div class="content">
          <div class="file-list">
            <ul v-if="list.length > 0">
              <li class="item" v-for="item in list" :key="item._id">
                <div class="icon" @click="clickHandler(item)">
                  <icon-file :size="24" :strokeWidth="2" v-if="item.type == 'file'" />
                  <icon-folder :size="24" :strokeWidth="2" v-else />
                </div>
                <div class="info" @click="clickHandler(item)">
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
import { defineComponent, ref, getCurrentInstance } from 'vue'
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
    const { directory, documentFormDrawerId, documentFormDrawerType, documentFormDrawerVisible } = storeToRefs(documentStore)

    const pageTitle = ref('所有文档的列表')
    const addBtns = ref(false)

    const list = ref<TypesDocument.IDocumentType[]>([])

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
    const clickHandler = (item: TypesDocument.IDocumentType) => {
      const _directory = [...item.directory]
      if (item.type === TypesBase.IBaseTypesType.FILE) {
        router.push({
          name: 'MobileMrkdown',
          params: {
            parents: item.directory,
            id: item._id
          }
        })
      } else {
        if (item._id) {
          _directory.push(item._id)
        }
        router.push(`/m/file/${_directory.join('/')}`)
      }
    }

    const getInfo = (id: string) => {
      documentStore.docInfo(id).then(res => {
        pageTitle.value = res.data?.title || '所有文档的列表'
      }).catch(err => {
        msg.error(err.message)
      })
    }

    if (route.params.path) {
      directory.value = [...route.params.path]
      const _lastId = directory.value[directory.value.length - 1]
      if (_lastId) {
        getInfo(_lastId)
      }
    }
    getList()

    const itemClickHandler = (item: ListItemType) => {
      router.push({
        name: 'MobileMrkdown',
        params: {
          parents: item.parents,
          id: item._id
        }
      })
    }

    const pageBack = () => {
      if (directory.value && directory.value.length > 0) {
        router.back()
      } else {
        router.push('/m/home')
      }
    }

    return {
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
      pageTitle,
      addBtns,
      list,
      dayjs,
 
      clickHandler,
      itemClickHandler
    }
  }
})
</script>
