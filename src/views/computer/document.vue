<template>
  <pkm-layout class="pkm-wh-100">
    <document-side-list ref="documentSideList" />
    <pkm-layout-content class="pkm-document-info" v-if="id">
      <pkm-spin dot :loading="loading" class="pkm-wh-100">
        <div class="view" v-if="currentType == 'view'">
          <div class="title">
            <pkm-typography-title class="heading" :heading="6">{{ info.title }}</pkm-typography-title>
            <div class="action">
              <pkm-button-group>
                <pkm-button type="secondary" @click="editInfo">
                  <template #icon>
                    <icon-info-circle />
                  </template>
                  属性
                </pkm-button>
                <pkm-button type="primary" @click="toEditor">
                  <template #icon>
                    <icon-edit />
                  </template>
                  编辑
                </pkm-button>
              </pkm-button-group>
            </div>
          </div>
          <div class="editor-box">
            <div class="markdown-body" v-html="md2html(info.content)"></div>
          </div>
        </div>
        <div class="markdown-editor" v-if="currentType == 'editor'">
          <div class="title">
          <pkm-typography-title class="heading" :heading="6">{{ info.title }}</pkm-typography-title>
            <div class="action">
              <pkm-button-group>
                <pkm-button type="secondary" @click="toView">
                  <template #icon>
                    <icon-close-circle />
                  </template>
                  关闭
                </pkm-button>
                <pkm-button type="primary" @click="saveContent">
                  <template #icon>
                    <icon-save />
                  </template>
                  保存
                </pkm-button>
              </pkm-button-group>
            </div>
          </div>
          <markdown-editor v-model="value" @toolbarItemAction="saveEditor" height="calc(100vh - 98px)" />
        </div>
      </pkm-spin>
      <document-form-drawer width="420px" :id="documentFormDrawerId" :type="documentFormDrawerType" :directory="directory" v-model="documentFormDrawerVisible" @done="drawerDone" />
    </pkm-layout-content>
  </pkm-layout>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, getCurrentInstance } from 'vue'
import * as MDEditor from '@totonoo/vue-codemirror'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import MarkdownEditor from '@/components/pkm-editor/markdown.vue'
import DocumentFormDrawer from '@/components/document/form-drawer.vue'
import DocumentSideList from './document/document-side-list.vue'

import '@/assets/scss/github-markdown.scss'

import useDocumentStore from '@/store/modules/document/index'
import * as TypesBase from '@/types/base'
import * as TypesDocument from '@/types/document'

export default defineComponent({
  components: {
    MarkdownEditor,
    DocumentSideList,
    DocumentFormDrawer
  },
  setup () {
    const app = getCurrentInstance()
    const msg = app?.appContext.config.globalProperties.$message
    const router = useRouter()
    const route = useRoute()
    const documentStore = useDocumentStore()
    const { currentId, currentType, directory, documentFormDrawerId, documentFormDrawerType, documentFormDrawerVisible } = storeToRefs(documentStore)

    const { id, type } = route.params as { id: string, type: string }

    const documentSideList = ref()
    const value = ref('')
    const loading = ref(false)
    const info = reactive<TypesDocument.IDocumentType>({
      ...documentStore.getFormDefault
    })

    const editInfo = () => {
      documentFormDrawerId.value = id
      documentFormDrawerVisible.value = true
    }

    const setInfoValue = (data: TypesDocument.IDocumentType) => {
      info._id = data._id
      info.title = data.title
      info.directory = data.directory
      info.cover = data.cover
      info.desc = data.desc
      info.tags = data.tags
      info.type = data.type
      info.content = data.content

      value.value = info.content
    }

    const getInfo = (_id: string) => {
      loading.value = true
      documentStore.getInfo(_id).then((res) => {
        if (res.data && res.data.type === TypesBase.IBaseTypesType.FILE) {
          setInfoValue(res.data)
          directory.value = res.data.directory || []
        }
      }).catch(err => {
        msg.error(err.message)
      }).finally(() => {
        loading.value = false
      })
    }

    const toView = () => {
      router.push(`/p/document/view/${id}`)
    }

    const toEditor = () => {
      router.push(`/p/document/editor/${id}`)
    }

    const saveContent = () => {
      if (id) {
        loading.value = true
        documentStore.saveContent({
          id,
          content: value.value
        }).then(() => {
          msg.success('保存成功')
        }).catch(err => {
          msg.error(err.message)
        }).finally(() => {
          loading.value = false
        })
      }
    }

    const saveEditor = (item: MDEditor.ToolbarItemType) => {
      if (item.type === 'Save') {
        saveContent()
      }
    }

    const drawerDone = () => {
      documentSideList.value.getList()
    }

    currentId.value = id
    currentType.value = type || 'view'
    if (id) {
      getInfo(id)
    }

    return {
      id,
      currentType,
      directory,

      documentSideList,
      
      documentFormDrawerId,
      documentFormDrawerType,
      documentFormDrawerVisible,
      drawerDone,

      info,
      editInfo,
      value,
      loading,
      toView,
      toEditor,
      saveContent,
      saveEditor,

      md2html: MDEditor.utils.md2html
    }
  }
})
</script>
<style lang="scss" scoped>
.editor-box {
  width: 100%;
  height: calc(100vh - 102px);
  padding: 8px 16px;
  box-sizing: border-box;
  overflow: auto;
  background-color: var(--color-bg-3);
}
</style>
