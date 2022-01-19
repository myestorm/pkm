<template>
  <div class="book-info">
    <pkm-page-header :title="info.title" :subtitle="info.author" @back="back">
      <div class="info-detail">
        <div class="image" :style="{
          backgroundImage: `url(${info.cover || '/images/no-book.png'})`
        }">
        </div>
        <div class="list">
          <pkm-space direction="vertical" fill>
            <h1>{{info.title}} - <span>{{info.author}}</span></h1>
            <pkm-typography-text type="secondary" class="desc">{{info.desc}}</pkm-typography-text>
            <dl>
              <dt>ISBN</dt>
              <dd>{{info.ISBN}}</dd>
            </dl>
            <dl>
              <dt>标签</dt>
              <dd>
                <pkm-space>
                  <pkm-tag v-for="(tag, index) in info.tags" :key="index">{{tag}}</pkm-tag>
                </pkm-space>
              </dd>
            </dl>
            <dl>
              <dt>状态</dt>
              <dd>
                <pkm-space>
                  <pkm-checkbox v-model="info.readed" disabled>已读</pkm-checkbox>
                  <pkm-checkbox v-model="info.heard" disabled>已听</pkm-checkbox>
                  <pkm-checkbox v-model="info.purchased" disabled>已买</pkm-checkbox>
                </pkm-space>
              </dd>
            </dl>
            <dl>
              <dt>评价</dt>
              <dd><pkm-rate v-model="info.rating" allow-half readonly /></dd>
            </dl>
          </pkm-space>
        </div>
      </div>
      <div class="notes">
        <div class="flex">
          <pkm-typography-title :heading="3" flex="auto">笔记</pkm-typography-title>
          <pkm-button type="primary" @click="addHandler">
            <template #icon>
              <icon-plus />
            </template>
            添加笔记
          </pkm-button>
        </div>
        <pkm-timeline>
          <pkm-timeline-item v-for="(note, index) in info.children" :key="index" :label="formatTime(note.updatedAt)" class="pkm-timeline-item">
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
      </div>
      <pkm-drawer class="md-drawer" width="56%" :visible="visible" @ok="saveHandler" :ok-loading="posting" @cancel="hideVisible" unmountOnClose>
        <template #title>
          笔记
        </template>
        <markdown-editor v-model:value="content" height="86%" :toolbar="editorToolbars"></markdown-editor>
        <div class="flex" style="padding: 16px;">
          排序：
          <pkm-input-number v-model="noteOrder" flex="auto" placeholder="数字越小越靠前" />
        </div>
      </pkm-drawer>
    </pkm-page-header>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, getCurrentInstance } from 'vue'
import { IApisBookUpdateType, IApisNoteUpdateType } from '../../../types/bookrack'
import { useStore  } from '../../store'
import { useRoute, useRouter } from 'vue-router'

import MarkdownEditor from '../../components/editor/markdown-editor.vue'
import Md2html from '../../components/editor/parser/md2html'

export default defineComponent({
  name: 'bookInfo',
  components: {
    MarkdownEditor
  },
  setup () {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const app = getCurrentInstance()
    const modal = app?.appContext.config.globalProperties.$modal
    const msg = app?.appContext.config.globalProperties.$message
    const formatTime = app?.appContext.config.globalProperties.$formatTime
    const groupId = <string>route.params.groupId
    const id = <string>route.params.id

    const formDefault: IApisBookUpdateType = {
      _id: '',
      groupId: '',
      title: '',
      author: '',
      cover: '',
      desc: '',
      readed: false,
      heard: false,
      purchased: false,
      ISBN: '',
      tags: [],
      rating: 0,
      children: [],
      order: 99
    }

    let info = reactive<IApisBookUpdateType>({
      ...formDefault
    })
    const getInfo = (gid: string, bid: string) => {
      store.dispatch('bookrack/bookInfo', {
        groupId: gid,
        id: bid
      }).then((res) => {
        if (res) {
          info = Object.assign(info, res)
        }
      }).catch(err => {
        msg.error(err.message)
      })
    }
    getInfo(groupId, id)

    const visible = ref<Boolean>(false)
    const posting = ref(false)
    const content = ref<string>('')
    const noteId = ref<string>('')
    const noteOrder = ref<number>(99)
    const editorToolbars = [
        ['header', 'blod', 'italic', 'strikethrough', 'hrline', 'quote', 'unordered-list', 'ordered-list', 'task-list', 'table', 'inline-code', 'block-code', 'link', 'media', 'format', 'preview', 'fullscreen'],
        [],
        []
      ]
    const showVisible = () => {
      visible.value = true
    }
    const hideVisible = () => {
      visible.value = false
    }

    const addHandler = () => {
      noteId.value = ''
      noteOrder.value = 99
      content.value = ''
      showVisible()
    }
    const eidtHandler = (index: number) => {
      const note = info.children[index]
      if (note) {
        noteId.value = note._id
        noteOrder.value = note.order
        content.value = note.content
        showVisible()
      }
    }
    const deleteHandler = (index: number) => {
      const note = info.children[index]
      if (note) {
        modal.open({
          title: '系统提示',
          content: `你确定要删除这条数据吗？`,
          hideCancel: false,
          simple: true,
          modalClass: ['pkm-modal-simple'],
          onOk () {
            store.dispatch('bookrack/noteRemove', {
              groupId: groupId,
              bookId: id,
              id: note._id
            }).then(() => {
              getInfo(groupId, id)
            }).catch(err => {
              msg.error(err.message)
            })
          }
        })
      }
    }

    const saveHandler = () => {
      posting.value = true
      const url = noteId.value ? 'bookrack/noteUpdate' : 'bookrack/noteAdd'
      const postData: IApisNoteUpdateType = {
        content: content.value,
        order: noteOrder.value,
        groupId: groupId,
        bookId: id
      }
      if (noteId.value) {
        postData._id = noteId.value
      }
      store.dispatch(url, postData).then(() => {
        hideVisible()
        getInfo(groupId, id)
      }).catch(err => {
        msg.error(err.message)
      }).then(() => {
        posting.value = false
      })
    }
    const back = () => {
      router.push('/book')
    }

    return {
      info,
      back,
      
      visible,
      posting,
      noteOrder,
      content,
      showVisible,
      hideVisible,
      editorToolbars,
      addHandler,
      eidtHandler,
      deleteHandler,
      saveHandler,
      formatTime,
      Md2html
    }
  }
})
</script>
<style lang="scss" scoped>
.book-info {
  color: var(--color-text-1);
  .info-detail {
    display: flex;
    .image {
      width: 280px;
      height: 376px;
      background-color: var(--color-black);
      background-position: center center;
      background-repeat: no-repeat;
      background-size: cover;
      img {
        width: 100%;
        display: block;
      }
    }
    .list {
      padding: 0 40px;
      flex: 1;
      dl {
        @include reset();
        padding: 8px 0;
        display: flex;
        align-items: center;
      }
    }
  }
  .notes {
    max-width: 960px;
  }
  .pkm-timeline-item {
    position: relative;
    .action {
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }
}
</style>
