<template>
  <pkm-layout-sider class="menu">
    <div class="menu-layout">
      <div class="header">
        <pkm-space direction="vertical" fill>
          <div class="pkm-add-button">
            <pkm-dropdown popup-container=".pkm-add-button">
              <pkm-button type="primary" long>
                <template #icon>
                  <icon-plus />
                </template>
                <template #default>
                  新建
                </template>
              </pkm-button>
              <template #content>
                <pkm-doption @click="creatDocument">
                  <template #icon>
                    <icon-file />
                  </template>
                  <template #default>
                    <span class="w">文档</span>
                  </template>
                </pkm-doption>
                <pkm-doption @click="creatFolder">
                  <template #icon>
                    <icon-folder />
                  </template>
                  <template #default>
                    <span class="w">目录</span>
                  </template>
                </pkm-doption>
              </template>
            </pkm-dropdown>
            <file-form-drawer width="420px" v-model="fileFormVisible" :type="fileFormType" :initValue="fileFormInitValue" @success="getList" />
          </div>
          <pkm-space class="flex">
            <pkm-button type="text" class="backto" @click="backTo" :disabled="parents.length == 0">
              <icon-left />
              后退
            </pkm-button>
            <pkm-input-search flex="auto" v-model="keyword" class="search-input" placeholder="试试搜索文档" :allow-clear="true" :loading=" loading" @input="searchHandler" @search="searchHandler" @clear="searchClear" />
          </pkm-space>
        </pkm-space>
      </div>
      <pkm-dropdown trigger="contextMenu" alignPoint class="pkm-contextmenu-dropdown" @select="test">
        <drag-sort v-model="list" class="file-list" :calcDropPosition="calcDropPosition" @end="dragEndHandler" @contextmenu="test($event, null)">
          <template #default="{ item, index }">
            <div class="item" :key="item._id" :class="[item._id == id ? 'current' : '', index % 2 == 0 ? 'odd' : '']">
              <div class="icon" @click="fileListItemClick(item)">
                <icon-file :size="24" :strokeWidth="2" v-if="item.type == 'document'" />
                <icon-folder :size="24" :strokeWidth="2" v-else />
              </div>
              <div class="info" @click="fileListItemClick(item)">
                <div class="title">{{ item.title }}</div>
                <div class="desc">{{ subStr(item.desc, 54) }}</div>
                <div class="day">
                  {{ dayjs(item.updatedAt).format('YYYY-MM-DD HH:mm') }}
                </div>
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
            </div>
          </template>
        </drag-sort>
        <template #content>
          <pkm-dgroup title="操作">
            <pkm-doption @click="creatDocument">
              <template #icon>
                <icon-copy />
              </template>
              <template #default>
                复制
              </template>
            </pkm-doption>
            <pkm-doption @click="creatFolder" disabled>
              <template #icon>
                <icon-scissor />
              </template>
              <template #default>
                剪切
              </template>
            </pkm-doption>
            <pkm-doption @click="creatFolder">
              <template #icon>
                <icon-paste />
              </template>
              <template #default>
                粘贴
              </template>
            </pkm-doption>
          </pkm-dgroup>
          <pkm-dgroup title="新建">
            <pkm-doption @click="creatDocument">
              <template #icon>
                <icon-file />
              </template>
              <template #default>
                文档
              </template>
            </pkm-doption>
            <pkm-doption @click="creatFolder">
              <template #icon>
                <icon-folder />
              </template>
              <template #default>
                目录
              </template>
            </pkm-doption>
          </pkm-dgroup>
        </template>
      </pkm-dropdown>
    </div>
  </pkm-layout-sider>
</template>
<script lang="ts">
import { defineComponent, ref, getCurrentInstance, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import useDocStore from '../../store/modules/document/index'

import FileFormDrawer from '../../components/file-form/drawer.vue'
import DragSort, { CalcDropPositionType, DropPositionType } from '../../components/drag-sort/index.vue'

import { DocumentList, DocumentRemove, DocumentSearch, DocumentUpdateParents } from '../../apis/document'
import { IDocumentFormType, IDocumentTypeType, IDocumentPageListItemType } from '../../../types/document'
import { subStr } from '../../utils/index'

export default defineComponent({
  components: {
    FileFormDrawer,
    DragSort
  },
  setup () {
    const app = getCurrentInstance()
    const msg = app?.appContext.config.globalProperties.$message
    const modal = app?.appContext.config.globalProperties.$modal
    const dayjs = app?.appContext.config.globalProperties.$dayjs
    const storeDoc = useDocStore()
    const router = useRouter()
    const { parents, list, id, keyword, fileFormVisible, fileFormType, fileFormInitValue  } = storeToRefs(storeDoc)
    const loading = ref(false)

    const creatDocument = () => {
      storeDoc.setTypeDoc()
      storeDoc.setFormDefault()
      fileFormVisible.value = true
    }
    const creatFolder = () => {
      storeDoc.setTypeFolder()
      storeDoc.setFormDefault()
      fileFormVisible.value = true
    }
    const getList = () => {
      DocumentList({
        parents: parents.value || []
      }).then(res => {
        list.value = res.data || []
      }).catch(err => {
        msg.error(err.message)
      })
    }
    const fileListItemClick = (item: IDocumentFormType) => {
      const type = item.type
      if (type === IDocumentTypeType.FOLDER) {
        const _parents = [...item.parents]
        const _id = (item._id || '') as string
        _parents.push(_id)
        parents.value = _parents
      } else if (type === IDocumentTypeType.DOC) {
        router.push(`/p/file/editor/${item._id}`)
      }
    }
    const backTo = () => {
      storeDoc.backTo()
    }
    const edit = (item: IDocumentFormType) => {
      storeDoc.setFormValue(item)
      if (item.type === IDocumentTypeType.FOLDER) {
        storeDoc.setTypeFolder()
      } else {
        storeDoc.setTypeDoc()
      }
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
          DocumentRemove(id).then(_ => {
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
        const conditions = [...parents.value]
        DocumentSearch(keyword.value, conditions).then(res => {
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

    watch(parents, (val, old) => {
      if (val.join('/') !== old.join('/')) {
        getList()
      }
    })
    getList()

    const calcDropPosition = (data : CalcDropPositionType) => {
      const { clientX, clientY, left, top, width, height, startClientX, dragIndex, dropIndex } = data
      // const dragItem = list.value[dragIndex]
      const dropItem = list.value[dropIndex]
      let dropPosition: DropPositionType = 0
      if (dropItem.type === IDocumentTypeType.DOC) {
        const h = height / 2
        if (clientY < top + h) {
          dropPosition = -1
        } else {
          dropPosition = 1
        }
      } else {
        const h = height / 4
        if (clientX - startClientX > 4) {
          dropPosition = 0
        } else {
          if (clientY < top + h) {
            dropPosition = -1
          } else if (clientY > top + (h * 3)) {
            dropPosition = 1
          } else {
            dropPosition = 0
          }
        }
      }
      return dropPosition
    }

    const dragEndHandler = (data: {
      dragIndex: number, 
      dropIndex: number, 
      dropPosition: DropPositionType, 
      oldList: IDocumentPageListItemType[], 
      list: IDocumentPageListItemType[]
    }) => {
      const { dragIndex, dropIndex, dropPosition, oldList, list } = data
      const dragItem = oldList[dragIndex]
      const dropItem = oldList[dropIndex]
      if (dropPosition === 0) { // 转移目录
        const _parents = [...dropItem.parents]
        _parents.push(dropItem._id)
        DocumentUpdateParents({ id: dragItem._id, parents: _parents }).then(_ => {
          getList()
        }).catch(err => {
          msg.error(err.message)
        })
      } else { // 排序

      }
    }
    return {
      dayjs,
      id,
      keyword,
      parents,
      fileFormVisible,
      fileFormType,
      fileFormInitValue,

      creatDocument,
      creatFolder,
      backTo,

      list,
      fileListItemClick,
      getList,
      edit,
      remove,
      subStr,

      loading,
      searchHandler,
      searchClear,
      calcDropPosition,
      dragEndHandler,
      test (a: Event, b: any) {
        console.log(a, b)
      }
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
    .file-list {
      height: calc(100vh - 142px);
      overflow: auto;
    }
  }
  .file-list {
    .item {
      width: 100%;
      display: flex;
      padding: 8px 0;
      cursor: pointer;
      align-items: stretch;
      transition: all 300ms ease;
      border-top: 1px solid transparent;
      border-bottom: 1px solid transparent;
      &::before {
        width: 3px;
        height: 0;
        content: "";
        display: block;
        background-color: rgb(var(--primary-6));
        position: absolute;
        top: 50%;
        left: 0;
        z-index: 3;
        transition: all 200ms ease;
        overflow: hidden;
      }
      &.odd {
        background-color: var(--color-fill-1);
      }
      &:hover, &.current {
        background-color: var(--color-fill-1);
        border-color: var(--color-neutral-3);
      }
      &:hover {
        background-color: rgb(var(--gray-3));
      }
      &.current {
        background-color: var(--color-fill-1);
        border-color: var(--color-neutral-3);
        box-shadow: 0 0 16px 0 rgba(0,0,0,0.12) inset;
        position: relative;
        &::before {
          top: 0;
          height: 100%;
        }
      }
      .icon {
        flex: 0 0 36px;
        color: var(--color-text-3);
        padding-left: 8px;
      }
      .info {
        flex: 1;
        padding: 0 8px;
        line-height: 1.4;
        .day {
          color: var(--color-text-4);
          font-size: 12px;
          padding-top: 4px;
        }
        .title {
          color: var(--color-text-2);
          font-size: 14px;
          font-weight: bold;
        }
        .desc {
          color: var(--color-text-3);
          font-size: 12px;
          padding: 4px 0;
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
