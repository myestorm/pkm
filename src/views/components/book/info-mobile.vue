<template>
  <div class="pkm-totonoo-info">
    <div class="content">
      <div class="pkm-totonoo-flex padding" align="start">
        <div class="cover">
          <img :src="pageData.cover || '/images/no-book.png'">
        </div>
        <div flex="auto">
          <pkm-typography-text class="desc" type="secondary">
            {{pageData.desc}}
          </pkm-typography-text>
        </div>
      </div>
      <pkm-space direction="vertical" size="medium">
        <dl>
          <dt>ISBN</dt>
          <dd>{{pageData.ISBN}}</dd>
        </dl>
        <dl>
          <dt>标签</dt>
          <dd>
            <pkm-space>
              <pkm-tag v-for="(tag, index) in pageData.tags" :key="index">{{tag}}</pkm-tag>
            </pkm-space>
          </dd>
        </dl>
        <dl>
          <dt>状态</dt>
          <dd>
            <pkm-space>
              <pkm-checkbox v-model="pageData.readed" disabled>已读</pkm-checkbox>
              <pkm-checkbox v-model="pageData.heard" disabled>已听</pkm-checkbox>
              <pkm-checkbox v-model="pageData.purchased" disabled>已买</pkm-checkbox>
            </pkm-space>
          </dd>
        </dl>
        <dl>
          <dt>评价</dt>
          <dd><pkm-rate v-model="pageData.rating" allow-half readonly /></dd>
        </dl>
      </pkm-space>
      <pkm-divider />
      <div class="notes">
        <pkm-typography-title :heading="5" flex="auto">笔记</pkm-typography-title>
        <div class="btn">
          <pkm-button type="primary" shape="circle" size="large" @click="showDrawer">
            <template #icon>
              <icon-plus />
            </template>
          </pkm-button>
        </div>
        <pkm-timeline v-if="pageData.notes.length > 0">
          <pkm-timeline-item v-for="(note, index) in pageData.notes" :key="index" :label="formatTime(note.updatedAt)" class="pkm-timeline-item">
            <div v-html="Md2html(note.content)"></div>
            <div class="action">
              <pkm-button type="text" @click="eidtHandler(index)">
                <template #icon>
                  <icon-edit />
                </template>
              </pkm-button>
              <pkm-button type="text" @click="deleteHandler(index)">
                <template #icon>
                  <icon-delete />
                </template>
              </pkm-button>
            </div>
          </pkm-timeline-item>
        </pkm-timeline>
        <pkm-empty v-else>暂无笔记</pkm-empty>
      </div>
    </div>
  </div>  
  <pkm-drawer :width="drawerWidth" class="pkm-editor-drawer" :visible="visible" :footer="false" @cancel="hideDrawer" unmountOnClose>
    <template #title>
      笔记
    </template>
    <pkm-spin class="block" :loading="loading" dot>
      <div class="markdown-editor">
        <markdown-editor v-model="editorValue" @toolbarItemAction="toolbarItemAction" height="calc(100vh - 48px)" />
      </div>
    </pkm-spin>
  </pkm-drawer>
</template>
<script lang="ts">
import { defineComponent, getCurrentInstance, ref, PropType, CSSProperties, computed } from 'vue'

import MarkdownEditor from '@/components/editor/markdown.vue'
import * as MDEditor from '@totonoo/vue-codemirror'
import * as TypesBook from '@/types/book'

import useBookStore from '@/store/book/index'

export interface BookInfoPropType {
  drawerWidth: CSSProperties['width'],
  data: TypesBook.IBookType
}

export default defineComponent({
  components: {
    MarkdownEditor
  },
  props: {
    drawerWidth: {
      type: String as PropType<BookInfoPropType['drawerWidth']>,
      default: '100%'
    },
    data: {
      type: Object as PropType<BookInfoPropType['data']>,
      default: {}
    }
  },
  emits: ['edit', 'update'],
  setup (props, ctx) {
    const app = getCurrentInstance()
    const bookStore = useBookStore()
    const formatTime = app?.appContext.config.globalProperties.$formatTime
    const msg = app?.appContext.config.globalProperties.$message
    const modal = app?.appContext.config.globalProperties.$modal
    
    const pageData = computed(() => {
      const _data = Object.assign({}, bookStore.getBookDefault, props.data)
      return _data
    })
    const setPageDataValue = (data: TypesBook.IBookType) => {
      pageData.value.id = data.id
      pageData.value.title = data.title
      pageData.value.author = data.author
      pageData.value.cover = data.cover
      pageData.value.desc = data.desc
      pageData.value.readed = data.readed
      pageData.value.heard = data.heard
      pageData.value.purchased = data.purchased
      pageData.value.ISBN = data.ISBN
      pageData.value.tags = data.tags
      pageData.value.rating = data.rating
      pageData.value.notes = data.notes
      pageData.value.createdAt = data.createdAt
      pageData.value.createdBy = data.createdBy
      pageData.value.updatedAt = data.updatedAt
      pageData.value.updatedBy = data.updatedBy
    }

    const nid = ref('') // 笔记ID
    const visible = ref(false)
    const loading = ref(false)
    const editorValue = ref('')
    const showDrawer = () => {
      nid.value = ''
      editorValue.value = ''
      visible.value = true
    }
    const hideDrawer = () => {
      visible.value = false
    }
    const toolbarItemAction = (item: MDEditor.ToolbarItemType) => {
      if (item.type === 'Save') {
        const postData = {
          content: editorValue.value
        }
        const bookId = pageData.value.id
        loading.value = true
        const actions = nid.value ? bookStore.noteUpdate(bookId, nid.value, postData) : bookStore.noteAdd(bookId, postData)
        actions.then(() => {
          msg.success('成功')
          visible.value = false
          ctx.emit('update')
        }).catch(err => {
          msg.error(err.message)
        }).then(() => {
          loading.value = false
        })
      }
    }
    const eidtHandler = (index: number) => {
      const item = pageData.value.notes[index]
      nid.value = item.id
      editorValue.value = item.content || ''
      visible.value = true
    }
    const deleteHandler = (index: number) => {
      const item = pageData.value.notes[index]
      modal.open({
        title: '系统提示',
        content: `该操作会删除内容，是否继续？`,
        hideCancel: false,
        simple: true,
        modalClass: ['pkm-totonoo-modal-simple'],
        onOk () {
          bookStore.noteRemove(pageData.value.id, item.id).then(_ => {
            ctx.emit('update')
          }).catch(err => {
            msg.error(err.message)
          })
        }
      })
    }
    const editBook = () => {
      ctx.emit('edit', pageData.value)
    }

    return {
      pageData,
      eidtHandler,
      deleteHandler,
      visible,
      loading,
      editorValue,
      showDrawer,
      hideDrawer,
      toolbarItemAction,
      formatTime,
      Md2html: MDEditor.utils.md2html,
      editBook
    }
  }
})
</script>
<style lang="scss" scoped>
.#{$--prefix}-info {
  width: 100%;
  color: var(--color-text-1);
  text-align: justify;
  .content {
    height: calc(100vh - 64px);
    overflow: auto;
    background-color: var(--color-bg-1);
    padding-top: 16px;
  }
  .header {
    padding: 8px;
  }
  .desc {
    display: block;
  }
  .padding {
    padding: 0 16px 16px 16px;
  }
  h6 {
    @include reset();
  }
  dl {
    @include reset();
    display: flex;
    align-items: center;
    padding: 0 16px;
  }
  img {
    width: 90px;
    border: 1px solid var(--color-neutral-3);
    margin-right: 20px;
    display: block;
  }
}
.notes {
  padding: 0 54px 0 16px;
  .btn {
    position: fixed;
    right: 16px;
    bottom: 16px;
    padding: 0;
  }
}
.pkm-timeline-item {
  position: relative;
  padding-bottom: 16px;
  text-align: justify;
  :deep(p) {
    margin: 0;
    padding: 0;
  }
  .action {
    position: absolute;
    right: 0;
    bottom: -6px;
  }
}
.markdown-editor {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: absolute;
  left: 0;
  top: 0;
  overflow: hidden;
}
</style>
