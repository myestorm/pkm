<template>
  <div class="pkm-file-editor">
    <div class="title">
      <pkm-typography-title class="heading" :heading="6">{{ title }}</pkm-typography-title>
      <div class="action">
        <pkm-button-group>
          <pkm-button type="secondary" @click="info">
            <template #icon>
              <icon-info-circle />
            </template>
            属性
          </pkm-button>
          <pkm-button type="primary" @click="save" :loading="loading">
            <template #icon>
              <icon-save />
            </template>
            保存
          </pkm-button>
        </pkm-button-group>
      </div>
    </div>
    <pkm-spin dot :loading="loading" class="block">
      <div class="markdown-editor">
        <markdown-editor v-model="value" @toolbarItemAction="toolbarItemAction" height="calc(100vh - 95px)" />
      </div>
    </pkm-spin>
  </div>
</template>
<script lang="ts">
import { defineComponent, getCurrentInstance, ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import useDocStore from '../../store/modules/document/index'

import MarkdownEditor from '../../components/editor/markdown.vue'
import { DocumentInfo, DocumentUpdate } from '../../apis/document'
import type { ToolbarItemType } from '@totonoo/vue-codemirror/dist_types/components/editor/markdown/toolbar'
import { IDocumentUpdateType, IDocumentTypeType } from '../../../types/document'

export default defineComponent({
  components: {
    MarkdownEditor
  },
  setup () {
    const route = useRoute()
    const app = getCurrentInstance()
    const msg = app?.appContext.config.globalProperties.$message
    const storeDoc = useDocStore()

    const { id } = route.params as { parents: string[], id: string }
    storeDoc.id = id

    const value = ref('')
    const loading = ref(false)
    const title = ref('')
    let form = reactive<IDocumentUpdateType>({
      ...storeDoc.getFormDefault
    })

    const getDocumentInfo = (id: string) => {
      loading.value = true
      DocumentInfo(id).then(res => {
        value.value = res.data?.content || ''
        title.value = res.data?.title || ''
        storeDoc.parents = res.data?.parents || []
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

    const save = () => {
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

    const info = () => {
      storeDoc.setFormValue(form)
      if (form.type === IDocumentTypeType.FOLDER) {
        storeDoc.setTypeFolder()
      } else {
        storeDoc.setTypeDoc()
      }
      storeDoc.fileFormVisible = true
    }

    const toolbarItemAction = (item: ToolbarItemType) => {
      if (item.type === 'Save') {
        save()
      }
    }
    
    if (id) {
      getDocumentInfo(id)
    }
    return {
      value,
      loading,
      title,
      toolbarItemAction,
      info,
      save
    }
  },
})
</script>
<style lang="scss" scoped>
.#{$--prefix}-file-editor {
  .title {
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--color-neutral-3);
    padding: 8px;
    background-color: var(--color-bg-3);
    .heading {
      flex: 1;
      margin: 0;
      padding-left: 8px;
    }
  }
}
</style>
