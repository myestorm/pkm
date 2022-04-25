<template>
  <mobile-layout title="文档" :subtitle="title" :footer="false" class="editor-page" :style="{
    paddingLeft: '0',
    paddingRight: '0',
    paddingBottom: '0'
  }">
      <template #main>
        <pkm-spin dot :loading="loading" style="width: 100%">
          <div class="markdown-editor">
            <markdown-editor v-model="value" @toolbarItemAction="toolbarItemAction" height="calc(100vh - 64px)" />
          </div>
        </pkm-spin>
      </template>
  </mobile-layout>
</template>
<script lang="ts">
import { defineComponent, getCurrentInstance, ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import MobileLayout from '@/components/layout/mobile-layout.vue'
import MarkdownEditor from '@/components/pkm-editor/markdown.vue'
import useDocumentStore from '@/store/modules/document/index'
import * as MDEditor  from '@totonoo/vue-codemirror'
import * as TypesDocument from '@/types/document'

export default defineComponent({
  components: {
    MobileLayout,
    MarkdownEditor
  },
  setup () {
    const route = useRoute()
    const documentStore = useDocumentStore()
    const app = getCurrentInstance()
    const msg = app?.appContext.config.globalProperties.$message

    const { id } = route.params as { parents: string[], id: string }

    const value = ref('')
    const loading = ref(false)
    const title = ref(id ? '' : '添加文档')
    let form = reactive<TypesDocument.IDocumentType>({
      ...documentStore.getFormDefault
    })

    const getDocumentInfo = (id: string) => {
      loading.value = true
      documentStore.docInfo(id).then(res => {
        value.value = res.data?.content || ''
        title.value = res.data?.title || '编辑文档'
        if (res.data) {
          form = {
            ...res.data
          }
        }
      }).catch(err => {
        msg.error(err.message)
      }).finally(() => {
        loading.value = false
      })
    }

    const toolbarItemAction = (item: MDEditor.ToolbarItemType) => {
      if (item.type === 'Save') {
        const postData = {
          id: form._id,
          content: value.value
        }
        if (postData.id) {
          loading.value = true
          documentStore.docSaveContent(postData).then(() => {
            msg.success('成功')
          }).catch(err => {
            msg.error(err.message)
          }).then(() => {
            loading.value = false
          })
        }
      }
    }
    
    if (id) {
      getDocumentInfo(id)
    }
    return {
      value,
      loading,
      title,
      toolbarItemAction
    }
  },
})
</script>
