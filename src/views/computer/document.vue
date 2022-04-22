<template>
  <pkm-spin dot :loading="loading" class="pkm-wh-100">
    <pkm-layout class="pkm-wh-100">
      <document-side-list />
      <pkm-layout-content>
        <div class="view">
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
                  编辑
                </pkm-button>
              </pkm-button-group>
            </div>
          </div>
          <div class="markdown-body">
            <blockquote><p>由于Markdown文档不支持新窗口打开，请按住ctrl键点击链接。<br>该文档会持续不断更新。</p></blockquote><h2 id="js%E6%A1%86%E6%9E%B6"><a class="header-anchor" href="#js%E6%A1%86%E6%9E%B6">¶</a> JS框架</h2><ul><li><a href="https://cn.vuejs.org/" target="_blank">VUEJS https://cn.vuejs.org/</a></li><li><a href="https://reactjs.org/" target="_blank">React https://reactjs.org/</a></li><li><a href="https://angularjs.org/" target="_blank">AngularJS https://angularjs.org/</a></li><li><a href="https://knockoutjs.com/index.html" target="_blank">KnockOut https://knockoutjs.com/index.html</a></li></ul><h2 id="node%E6%A1%86%E6%9E%B6"><a class="header-anchor" href="#node%E6%A1%86%E6%9E%B6">¶</a> NODE框架</h2><ul><li><a href="https://koajs.com/" target="_blank">KOA https://koajs.com/</a></li><li><a href="https://expressjs.com/" target="_blank">Express https://expressjs.com/</a></li><li><a href="https://gulpjs.com/" target="_blank">Gulp https://gulpjs.com/</a></li><li><a href="https://gruntjs.com/" target="_blank">Grunt https://gruntjs.com/</a></li></ul><h2 id="ui%E6%A1%86%E6%9E%B6"><a class="header-anchor" href="#ui%E6%A1%86%E6%9E%B6">¶</a> UI框架</h2><ul><li><a href="https://element.eleme.cn/#/zh-CN" target="_blank">ElementUI https://element.eleme.cn/#/zh-CN</a> vue</li><li><a href="https://ant.design/index-cn" target="_blank">AntDesign https://ant.design/index-cn</a> react</li><li><a href="https://vuetifyjs.com/" target="_blank">Vuetify https://vuetifyjs.com/</a> vue</li></ul>
          </div>
        </div>
        <div class="markdown-editor">
          <markdown-editor v-model="value" @toolbarItemAction="saveContent" height="calc(100vh - 98px)" />
        </div>
      </pkm-layout-content>
    </pkm-layout>
  </pkm-spin>
</template>
<script lang="ts">
import { defineComponent, ref, getCurrentInstance } from 'vue'
import { utils } from '@totonoo/vue-codemirror'
import { useRoute } from 'vue-router'

import type { ToolbarItemType } from '@totonoo/vue-codemirror/dist_types/components/editor/markdown/toolbar'

import MarkdownEditor from '@/components/pkm-editor/markdown.vue'
import DocumentSideList from './document/document-side-list.vue'

import '@/assets/scss/github-markdown.scss'

import useDocumentStore from '@/store/modules/document/index'

export default defineComponent({
  components: {
    MarkdownEditor,
    DocumentSideList
  },
  setup () {
    const app = getCurrentInstance()
    const msg = app?.appContext.config.globalProperties.$message
    const route = useRoute()
    const documentStore = useDocumentStore()

    const { id = '' } = route.params as { id: string }
    const value = ref('')
    const loading = ref(false)
    const type = ref('view')

    const getInfo = (_id: string) => {
      documentStore.getInfo(_id).then(() => {
        msg.success('保存成功')
      }).catch(err => {
        msg.error(err.message)
      }).finally(() => {
        loading.value = false
      })
    }

    const saveContent = (item: ToolbarItemType) => {
      if (item.type === 'Save') {
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
    }
    console.log(utils.md2html)
    if (id) {
      getInfo(id)
    }

    return {
      type,
      value,
      loading,
      saveContent
    }
  }
})
</script>
