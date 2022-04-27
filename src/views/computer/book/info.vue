<template>
  <pkm-space direction="vertical" class="book-info" size="medium">
    <h1 class="pkm-flex">
      <div flex="auto">
      {{pageData.title}} - <span>{{pageData.author}}</span>
      </div>
      <pkm-button type="primary" @click="editBook">
        <template #icon>
          <icon-edit />
        </template>
        编辑
      </pkm-button>
    </h1>
    <pkm-divider />
    <div class="pkm-flex" align="start">
      <div class="cover">
        <img :src="pageData.cover || '/images/no-book.png'">
      </div>
      <div flex="auto" style="padding: 8px 0">
        <pkm-space direction="vertical" size="large">
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
      </div>
    </div>
    <pkm-typography-text type="secondary">
      {{pageData.desc}}
    </pkm-typography-text>
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
import { defineComponent, getCurrentInstance, reactive, ref, PropType, CSSProperties } from 'vue'

import BookForm from '@/components/pkm-book/form.vue'
import MarkdownEditor from '@/components/pkm-editor/markdown.vue'
import * as MDEditor from '@totonoo/vue-codemirror'
import * as TypesBook from '@/types/book'

import useBookStore from '@/store/modules/book/index'

export interface BookInfoPropType {
  drawerWidth: CSSProperties['width'],
  id: string
}

export default defineComponent({
  components: {
    BookForm,
    MarkdownEditor
  },
  props: {
    drawerWidth: {
      type: String as PropType<BookInfoPropType['drawerWidth']>,
      default: '100%'
    },
    id: {
      type: String as PropType<BookInfoPropType['id']>,
      default: ''
    }
  },
  emits: ['edit', 'ready'],
  setup (props, ctx) {
    const app = getCurrentInstance()
    const bookStore = useBookStore()
    const formatTime = app?.appContext.config.globalProperties.$formatTime
    const msg = app?.appContext.config.globalProperties.$message
    const modal = app?.appContext.config.globalProperties.$modal
    
    const pageData = reactive<TypesBook.IBookType>({
      ...bookStore.getBookDefault
    })
    const setPageDataValue = (data: TypesBook.IBookType) => {
      pageData._id = data._id
      pageData.title = data.title
      pageData.author = data.author
      pageData.cover = data.cover
      pageData.desc = data.desc
      pageData.readed = data.readed
      pageData.heard = data.heard
      pageData.purchased = data.purchased
      pageData.ISBN = data.ISBN
      pageData.tags = data.tags
      pageData.rating = data.rating
      pageData.notes = data.notes
      pageData.createdAt = data.createdAt
      pageData.createdBy = data.createdBy
      pageData.updatedAt = data.updatedAt
      pageData.updatedBy = data.updatedBy
    }
    const getInfo = (id: string, isReady: boolean = false) => {
      bookStore.bookInfo(id).then(res => {
        if (res.data) {
          setPageDataValue(res.data)
          if (isReady) {
            ctx.emit('ready', res.data)
          }
        }
      }).catch(err => {
        msg.error(err.message)
      })
    }
    if (props.id) {
      getInfo(props.id, true)
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
        loading.value = true
        const actions = nid.value ? bookStore.noteUpdate(props.id, nid.value, postData) : bookStore.noteAdd(props.id, postData)
        actions.then(() => {
          msg.success('成功')
          visible.value = false
          getInfo(props.id)
        }).catch(err => {
          msg.error(err.message)
        }).then(() => {
          loading.value = false
        })
      }
    }
    const eidtHandler = (index: number) => {
      const item = pageData.notes[index]
      nid.value = item._id
      editorValue.value = item.content || ''
      visible.value = true
    }
    const deleteHandler = (index: number) => {
      const item = pageData.notes[index]
      modal.open({
        title: '系统提示',
        content: `该操作会删除内容，是否继续？`,
        hideCancel: false,
        simple: true,
        modalClass: ['pkm-modal-simple'],
        onOk () {
          bookStore.noteRemove(props.id, item._id).then(_ => {
            getInfo(props.id)
          }).catch(err => {
            msg.error(err.message)
          })
        }
      })
    }
    const editBook = () => {
      ctx.emit('edit', pageData)
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
      editBook,

      getInfo
    }
  }
})
</script>
<style lang="scss" scoped>
.book-info {
  width: 100%;
  color: var(--color-text-1);
  text-align: justify;
  h1 {
    @include reset();
  }
  dl {
    @include reset();
    display: flex;
    align-items: center;
  }
  img {
    width: 200px;
    border: 1px solid var(--color-neutral-3);
    margin-right: 20px;
    display: block;
  }
}
.notes {
  padding-right: 54px;
  .btn {
    position: fixed;
    right: 16px;
    bottom: 4px;
    padding: 16px;
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
    bottom: 0;
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
