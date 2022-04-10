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
                  <icon-file :size="24" :strokeWidth="2" v-if="item.type == 'document'" />
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
            <pkm-button type="primary" status="warning" shape="circle" size="large" @click="add('document')"><icon-file /></pkm-button>
          </pkm-space>
          <pkm-button type="primary" shape="circle" size="large" @click="showBtn = !showBtn">
            <icon-plus />
          </pkm-button>
        </pkm-space>
        <file-form-drawer v-model="drawerVisible" :type="type" :initValue="drawerData" @success="successHandler" />
      </div>
    </template>
  </mobile-layout>
</template>
<script lang="ts">
import { defineComponent, ref, getCurrentInstance } from 'vue'
import MobileLayout from '../../components/layout/mobile-layout.vue'
import FileFormDrawer from '../../components/file-form/drawer.vue'
import SearchList, { ListItemType } from '../../components/search-list/index.vue'
import useCommonStore from '../../store/index'
import { useRouter, useRoute } from 'vue-router'
import { DocumentList, DocumentRemove, DocumentSearch, DocumentInfo } from '../../apis/document'
import { IDocumentPageListItemType, IDocumentFormType, IDocumentTypeType, IDocumentSearchType } from '../../../types/document'

export default defineComponent({
  components: {
    MobileLayout,
    FileFormDrawer,
    SearchList
  },
  setup () {
    const app = getCurrentInstance()
    const msg = app?.appContext.config.globalProperties.$message
    const modal = app?.appContext.config.globalProperties.$modal
    const dayjs = app?.appContext.config.globalProperties.$dayjs
    const store = useCommonStore()
    const router = useRouter()
    const route = useRoute()

    const pageTitle = ref('所有文档的列表')
    const showBtn = ref(false)
    const drawerVisible = ref(false)
    const type = ref()

    const list = ref<IDocumentPageListItemType[]>([])
    const drawerData = ref<IDocumentFormType>()
    const filePath = ref<string[]>([])

    const getList = () => {
      DocumentList({
        parents: [...filePath.value]
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
        _id: '',
        parents: [...filePath.value],
        title: '',
        type: _type as IDocumentTypeType,
        authorId: '',
        cover: '',
        desc: '',
        content: '',
        tags: [],
        top: false
      }
      drawerVisible.value = true
    }
    const edit = (item: IDocumentFormType) => {
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
          DocumentRemove(id).then(_ => {
            getList()
          }).catch(err => {
            msg.error(err.message)
          })
        }
      })
    }
    const clickHandler = (item: IDocumentFormType) => {
      const _parents = [...item.parents]
      if (item.type === IDocumentTypeType.DOC) {
        router.push({
          name: 'MobileMrkdown',
          params: {
            parents: item.parents,
            id: item._id
          }
        })
      } else {
        if (item._id) {
          _parents.push(item._id)
        }
        router.push(`/m/file/${_parents.join('/')}`)
      }
    }

    const getInfo = (id: string) => {
      DocumentInfo(id).then(res => {
        pageTitle.value = res.data?.title || '所有文档的列表'
      }).catch(err => {
        msg.error(err.message)
      })
    }
    
    store.mobile.current = 1

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
