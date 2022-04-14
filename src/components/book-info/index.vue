<template>
  <pkm-space direction="vertical" class="book-info" size="medium">
    <h1>{{pageData.title}} - <span>{{pageData.author}}</span></h1>
    <div class="desc">
      <img :src="pageData.cover || '/images/no-book.png'">
      <pkm-typography-text type="secondary">
        {{pageData.desc}}
      </pkm-typography-text>
    </div>
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
    <pkm-button type="outline" long size="small" @click="editBook">
      编辑
    </pkm-button>
  </pkm-space>
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
  <pkm-drawer :width="drawerWidth" class="editor-drawer" :visible="visible" :footer="false" @cancel="hideDrawer" unmountOnClose>
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

import BookForm from '../book-form/index.vue'
import Md2html from '../editor/parser/md2html'
import MarkdownEditor from '../editor/markdown.vue'
import type { ToolbarItemType } from '@totonoo/vue-codemirror/dist_types/components/editor/markdown/toolbar'
import { IBookDataApiType } from '../../../types/book'

import { BookInfo, NoteAdd, NoteUpdate, NoteRemove } from '../../apis/book'

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
  emits: ['edit', 'getInfo'],
  setup (props, ctx) {
    const app = getCurrentInstance()
    const formatTime = app?.appContext.config.globalProperties.$formatTime
    const msg = app?.appContext.config.globalProperties.$message
    const modal = app?.appContext.config.globalProperties.$modal
    
    const formDefault = {
      _id: '',
      title: '',
      author: '',
      cover: '',
      desc: '',
      readed: false,
      heard: false,
      purchased: false,
      ISBN: '',
      tags: [],
      rating: 3,
      notes: [], 
      createdAt: new Date(), 
      createdBy: '', 
      updatedAt: new Date(), 
      updatedBy: ''
    }
    const pageData = reactive<IBookDataApiType>(formDefault)
    const setPageDataValue = (data: IBookDataApiType) => {
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
    const getInfo = (id: string) => {
      BookInfo(id).then(res => {
        if (res.data) {
          setPageDataValue(res.data)
          ctx.emit('getInfo', pageData)
        }
      }).catch(err => {
        msg.error(err.message)
      })
    }
    if (props.id) {
      getInfo(props.id)
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
    const toolbarItemAction = (item: ToolbarItemType) => {
      if (item.type === 'Save') {
        const postData = {
          content: editorValue.value
        }
        loading.value = true
        const actions = nid.value ? NoteUpdate(props.id, nid.value, postData) : NoteAdd(props.id, postData)
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
          NoteRemove(props.id, item._id).then(_ => {
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
      Md2html,
      editBook
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
  .desc {
    display: flex;
    align-items: flex-start;
  }
  img {
    width: 80px;
    border: 1px solid var(--color-neutral-3);
    margin-right: 20px;
    display: inline-block;
  }
}
.notes {
  padding-right: 54px;
  .btn {
    position: fixed;
    right: 0;
    bottom: 0;
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
<style lang="scss">
.editor-drawer {
  .arco-drawer-body {
    width: 100%;
    padding: 0;
    margin: 0;
  }
}
</style>
