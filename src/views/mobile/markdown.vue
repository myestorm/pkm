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
import MobileLayout from '../../components/layout/mobile-layout.vue'
import MarkdownEditor from '../../components/editor/markdown.vue'
import { DocumentInfo, DocumentUpdate } from '../../apis/document'
import type { ToolbarItemType } from '@totonoo/vue-codemirror/dist_types/components/editor/markdown/toolbar'
import { IDocumentUpdateType, IDocumentTypeType } from '../../../types/document'

export default defineComponent({
  components: {
    MobileLayout,
    MarkdownEditor
  },
  setup () {
    const route = useRoute()
    const app = getCurrentInstance()
    const msg = app?.appContext.config.globalProperties.$message

    const { id } = route.params as { parents: string[], id: string }

    const value = ref('')
    const loading = ref(false)
    const title = ref(id ? '' : '添加文档')
    const formDefault = {
      _id: '',
      parents: [],
      title: '',
      type: IDocumentTypeType.DOC,
      authorId: '',
      cover: '',
      desc: '',
      content: '',
      tags: [],
      top: false
    }
    let form = reactive<IDocumentUpdateType>({
      ...formDefault
    })

    const getDocumentInfo = (id: string) => {
      loading.value = true
      DocumentInfo(id).then(res => {
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

    const toolbarItemAction = (item: ToolbarItemType) => {
      if (item.type === 'Save') {
        const postData = {
          ...form,
          content: value.value
        }
        if (postData._id) {
          loading.value = true
          DocumentUpdate(postData).then(() => {
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
