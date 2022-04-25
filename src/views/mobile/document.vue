<template>
  <mobile-layout title="文档" :subtitle="pageTitle" :back="pageBack">
    <template #main>
      <div class="pkm-mobile-file-list">
        <search-list placeholder="搜索当前文档" type="document" :conditions="filePath" @itemClick="itemClickHandler"></search-list>
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
          <pkm-space direction="vertical" fill v-show="showBtn">
            <pkm-button type="primary" status="success" shape="circle" size="large" @click="add('folder')"><icon-folder /></pkm-button>
            <pkm-button type="primary" status="warning" shape="circle" size="large" @click="add('file')"><icon-file /></pkm-button>
          </pkm-space>
          <pkm-button type="primary" shape="circle" size="large" @click="showBtn = !showBtn">
            <icon-plus />
          </pkm-button>
        </pkm-space>
        <document-form-drawer width="100%" v-model="drawerVisible" :type="type" :initValue="drawerData" @success="successHandler" />
      </div>
    </template>
  </mobile-layout>
</template>
<script lang="ts">
import { defineComponent, ref, getCurrentInstance } from 'vue'
import MobileLayout from '@/components/layout/mobile-layout.vue'
import DocumentFormDrawer from '@/components/pkm-document/form-drawer.vue'
import SearchList, { ListItemType } from '@/components/search-list/index.vue'
import { useRouter, useRoute } from 'vue-router'
import useDocumentStore from '@/store/modules/document/index'
import * as TypesBase from '@/types/base'
import * as TypesDocument from '@/types/document'

export default defineComponent({
  components: {
    MobileLayout,
    DocumentFormDrawer,
    SearchList
  },
  setup () {
    const app = getCurrentInstance()
    const msg = app?.appContext.config.globalProperties.$message
    const modal = app?.appContext.config.globalProperties.$modal
    const dayjs = app?.appContext.config.globalProperties.$dayjs
    const router = useRouter()
    const route = useRoute()
    const documentStore = useDocumentStore()

    const pageTitle = ref('所有文档的列表')
    const showBtn = ref(false)
    const drawerVisible = ref(false)
    const type = ref()

    const list = ref<TypesDocument.IDocumentType[]>([])
    const drawerData = ref<TypesDocument.IDocumentType>()
    const filePath = ref<string[]>([])

    const getList = () => {
      documentStore.docList({
        directory: [...filePath.value]
      }).then(res => {
        list.value = res.data || []
      }).catch(err => {
        msg.error(err.message)
      })
    }
    const successHandler = () => {
      getList()
    }
    const add = (_type: string) => {
      type.value = _type
      drawerData.value = {
        ...documentStore.getFormDefault,
        directory: [...filePath.value],
        type: _type as TypesBase.IBaseTypesType
      }
      drawerVisible.value = true
    }
    const edit = (item: TypesDocument.IDocumentType) => {
      type.value = item.type
      drawerData.value = item
      drawerVisible.value = true
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
    const clickHandler = (item: TypesDocument.IDocumentFileFormType) => {
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
      filePath.value = [...route.params.path]
      const _lastId = filePath.value[filePath.value.length - 1]
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
      if (filePath.value && filePath.value.length > 0) {
        router.back()
      } else {
        router.push('/m/home')
      }
    }

    return {
      pageBack,
      filePath,
      pageTitle,
      showBtn,
      drawerVisible,
      type,
      list,
      dayjs,
      drawerData,
      add,
      edit,
      remove,
      successHandler,
      clickHandler,
      itemClickHandler
    }
  }
})
</script>
