<template>
  <pkm-layout-sider class="menu">
    <div class="menu-layout">
      <div class="header">
        <pkm-space direction="vertical" fill>
          <div class="pkm-add-button">
            <pkm-button type="primary" long @click="creat">
              <template #icon>
                <icon-plus />
              </template>
              <template #default>
                新建
              </template>
            </pkm-button>
            <book-form-drawer width="420px" v-model="fileFormVisible" :id="formId" @success="getList" />
          </div>
          <pkm-input-search flex="auto" v-model="keyword" class="search-input block" placeholder="试试搜索书籍" :allow-clear="true" :loading=" loading" @input="searchHandler" @search="searchHandler" @clear="searchClear" />
        </pkm-space>
      </div>
      <div class="book-list">
        <ul>
          <li class="item" v-for="item in list" :key="item._id" :class="[item._id == id ? 'current' : '']">
            <div class="icon" @click="fileListItemClick(item)">
              <img :src="item.cover || '/images/no-book.png'">
            </div>
            <div class="info" @click="fileListItemClick(item)">
              <div class="title" :title="item.title">{{ subStr(item.title, 16) }}</div>
              <div class="author" :title="item.author">{{ subStr(item.author, 20) }}</div>
              <div class="desc">{{ subStr(item.desc, 58) }}</div>
            </div>
            <div class="action">
              <pkm-dropdown position="br">
                <pkm-button-group>
                  <pkm-button type="text" class="btn-info" size="mini">
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
      </div>
    </div>
  </pkm-layout-sider>
</template>
<script lang="ts">
import { defineComponent, ref, getCurrentInstance, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import useBookStore from '../../store/modules/book/index'
import BookFormDrawer from '../../components/book-form/drawer.vue'
import { BookList, BookRemove, BookSearch } from '../../apis/book'
import { IBookDataApiType } from '../../../types/book'
import { subStr } from '../../utils/index'

export default defineComponent({
  components: {
    BookFormDrawer
  },
  setup () {
    const app = getCurrentInstance()
    const msg = app?.appContext.config.globalProperties.$message
    const modal = app?.appContext.config.globalProperties.$modal
    const storeBook = useBookStore()
    const router = useRouter()
    const { list, id, keyword, fileFormVisible, fileFormInitValue } = storeToRefs(storeBook)
    const loading = ref(false)
    const formId = ref('')

    const creat = () => {
      formId.value = ''
      fileFormVisible.value = true
    }
    const getList = () => {
      BookList({}).then(res => {
        list.value = res.data || []
      }).catch(err => {
        msg.error(err.message)
      })
    }
    const fileListItemClick = (item: IBookDataApiType) => {
      router.push(`/p/book/view/${item._id}`)
    }
    const edit = (item: IBookDataApiType) => {
      formId.value = item._id
      fileFormVisible.value = true
    }
    const remove = (id: string) => {
      modal.open({
        title: '系统提示',
        content: `该操作会删除内容，是否继续？`,
        hideCancel: false,
        simple: true,
        modalClass: ['pkm-modal-simple'],
        onOk () {
          BookRemove(id).then(_ => {
            getList()
          }).catch(err => {
            msg.error(err.message)
          })
        }
      })
    }
    const searchHandler = () => {
      if (keyword.value) {
        loading.value = true
        BookSearch(keyword.value).then(res => {
          list.value = res.data || []
        }).catch(_ => {
          list.value = []
        }).finally(() => {
          loading.value = false
        })
      }
    }
    const searchClear = () => {
      getList()
    }

    getList()
    return {
      id,
      keyword,
      fileFormVisible,
      fileFormInitValue,

      getList,

      creat,
      formId,

      list,
      fileListItemClick,
      edit,
      remove,
      subStr,

      loading,
      searchHandler,
      searchClear
    }
  }
})
</script>
<style lang="scss" scoped>
.#{$--prefix}-file-layout {
  .menu {
    width: 280px !important;
    background-color: var(--color-fill-2);
    box-shadow: none;
    border-right: 1px solid var(--color-neutral-3);
  }
  .menu-layout {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    .header {
      padding: 8px;
      .search-input {
        background-color: var(--color-bg-1);
      }
      .backto {
        padding-left: 0;
        padding-right: 8px;
      }
    }
    .book-list {
      height: calc(100vh - 142px);
      overflow: auto;
    }
  }
  .book-list {
    ul, li {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .item {
      display: flex;
      padding: 8px 0;
      cursor: pointer;
      align-items: stretch;
      transition: all 300ms ease;
      border-top: 1px solid transparent;
      border-bottom: 1px solid transparent;
      &:nth-child(odd) {
        background-color: var(--color-fill-1);
      }
      &:hover {
        background-color: rgb(var(--gray-3)) !important;
      }
      &.current {
        background-color: var(--color-fill-1) !important;
        border-color: var(--color-neutral-3);
        box-shadow: 0 0 16px 0 rgba(0,0,0,0.12) inset;
      }
      .icon {
        flex: 0 0 30%;
        padding-left: 8px;
        img {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid var(--color-neutral-3);
          padding: 2px;
          border-radius: var(--border-radius-small);
        }
      }
      .info {
        flex: 1;
        padding: 0 8px;
        .title {
          color: rgb(var(--primary-6));
          font-size: 14px;
          // font-weight: bold;
          padding: 4px 0;
        }
        .author {
          color: var(--color-text-2);
          font-size: 14px;
          padding: 4px 0;
        }
        .desc {
          color: var(--color-text-3);
          font-size: 12px;
          padding: 4px 0;
          // text-align: justify;
          line-height: 1.4;
        }
      }
      .action {
        flex: 0 0 32px;
        margin-right: 8px;
        text-align: right;
        .btn-info {
          color: var(--color-text-3);
        }
      }
    }
  }
}
</style>
<style lang="scss">
.#{$--prefix}-add-button {
  .arco-trigger-popup {
    width: 264px;
    box-sizing: border-box;
    left: 8px !important;
    .arco-dropdown-option {
      justify-content: center;
    }
  }
}
</style>
