<template>
  <pkm-layout-sider class="pkm-side-list">
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
                    <span class="name">文档</span>
                  </template>
                </pkm-doption>
                <pkm-doption @click="creatFolder">
                  <template #icon>
                    <icon-folder />
                  </template>
                  <template #default>
                    <span class="name">目录</span>
                  </template>
                </pkm-doption>
              </template>
            </pkm-dropdown>
          </div>
          <pkm-space class="flex">
            <pkm-button type="text" class="backto" @click="backTo" :disabled="directory.length == 0">
              <icon-left />
              后退
            </pkm-button>
            <pkm-input-search flex="auto" v-model="keyword" class="search-input" placeholder="试试搜索文档" :allow-clear="true" :loading=" loading" @input="searchHandler" @search="searchHandler" @clear="searchClear" />
          </pkm-space>
          <pkm-breadcrumb :style="{ fontSize: `14px` }" :max-count="3">
            <pkm-breadcrumb-item>
              <pkm-button type="text" size="mini" style="padding: 0" @click="directory = []">
                <icon-folder />
              </pkm-button>
            </pkm-breadcrumb-item>
            <pkm-breadcrumb-item v-for="item in breadcrumbs" :key="item._id">
              <pkm-button type="text" size="mini" style="padding: 0" @click="breadcrumbClick(item)">{{ item.title }}</pkm-button>
            </pkm-breadcrumb-item>
            <template #separator>
              <icon-right />
            </template>
          </pkm-breadcrumb>
        </pkm-space>
      </div>
      <pkm-dropdown trigger="contextMenu" alignPoint class="pkm-contextmenu-dropdown">
        <pkm-drag-sort v-model="list" class="file-list" :calcDropPosition="calcDropPosition" @end="dragEndHandler" @contextmenu="contextmenuHandler($event)">
          <template #default="{ item, index }">
            <div class="item" :data-index="index" :key="item._id" :class="[item._id == currentId ? 'current' : '', index % 2 == 0 ? 'odd' : '']">
              <div class="icon" :class="[item.type == 'file' ? `image` : '']" @click="fileListItemClick(item)">
                <img :src="item.cover || '/images/no-book.png'" v-if="item.type == 'file'">
                <icon-folder :size="24" :strokeWidth="2" v-else />
              </div>
              <div class="info" @click="fileListItemClick(item)">
                <template v-if="item.type == 'file'">
                  <div class="title" :title="item.title">{{ subStr(item.title, 16) }}</div>
                  <div class="author" :title="item.author">{{ subStr(item.author, 20) }}</div>
                  <div class="desc">{{ subStr(item.desc, 58) }}</div>
                </template>
                <template v-else>
                  <div class="title">{{ item.title }}</div>
                  <div class="desc">{{ subStr(item.desc, 54) }}</div>
                </template>
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
                    <pkm-doption @click="edit(item._id)">
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
        </pkm-drag-sort>
        <template #content>
          <pkm-dgroup title="操作">
            <pkm-doption @click="copyHandler" :disabled="tempIndex == -1">
              <template #icon>
                <icon-copy />
              </template>
              <template #default>
                复制
              </template>
            </pkm-doption>
            <pkm-doption @click="cutHandler" :disabled="tempIndex == -1">
              <template #icon>
                <icon-scissor />
              </template>
              <template #default>
                剪切
              </template>
            </pkm-doption>
            <pkm-doption @click="pasteHandler" :disabled="!clipboard">
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

import * as TypesBase from '@/types/base'
import * as TypesBook from '@/types/book'

import useBookStore from '@/store/modules/book/index'


import PkmDragSort, { CalcDropPositionType, DropPositionType } from '@/components/pkm-drag-sort/index.vue'

import { subStr } from '@/utils/index'

export default defineComponent({
  components: {
    PkmDragSort
  },
  setup () {
    const app = getCurrentInstance()
    const msg = app?.appContext.config.globalProperties.$message
    const modal = app?.appContext.config.globalProperties.$modal
    const dayjs = app?.appContext.config.globalProperties.$dayjs
    const bookStore = useBookStore()
    const router = useRouter()
    const { currentId, directory, list, keyword, clipboard, clipboardType } = storeToRefs(bookStore)
    const loading = ref(false)
    const breadcrumbs = ref<TypesBase.IBreadcrumbType[]>([])

    const creatDocument = () => {
      bookStore.create(TypesBase.IBaseTypesType.FILE)
    }
    const creatFolder = () => {
      bookStore.create(TypesBase.IBaseTypesType.FOLDER)
    }

    const getList = () => {
      bookStore.bookList({
        directory: directory.value || []
      }).then(res => {
        list.value = res?.data || []
      }).catch(err => {
        msg.error(err.message)
      })
    }

    const fileListItemClick = (item: TypesBook.IBookType) => {
      const type = item.type
      if (type === TypesBase.IBaseTypesType.FOLDER) {
        const _directory = [...item.directory]
        const _id = (item._id || '') as string
        _directory.push(_id)
        directory.value = _directory
      } else if (type === TypesBase.IBaseTypesType.FILE) {
        router.push(`/p/book/${item._id}`)
      }
    }
    const backTo = () => {
      bookStore.backTo()
    }
    const edit = (_id: string) => {
      bookStore.edit(_id)
    }
    const remove = (id: string) => {
      modal.open({
        title: '系统提示',
        content: `该操作会删除内容，是否继续？`,
        hideCancel: false,
        simple: true,
        modalClass: ['pkm-modal-simple'],
        onOk () {
          bookStore.bookRemove(id).then(_ => {
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
        const _directory = [...directory.value]
        bookStore.bookSearch(keyword.value, _directory).then(res => {
          list.value = res.data || []
        }).catch(_ => {
          list.value = []
        }).finally(() => {
          loading.value = false
        })
      } else {
        getList()
      }
    }
    const searchClear = () => {
      getList()
    }

    watch(directory, (val, old) => {
      if (val.join('/') !== old.join('/')) {
        getList()
      }
      if (val.length > 0) {
        bookStore.bookBreadcrumbs(val).then(res => {
          const _data = (res.data || []) as TypesBase.IBreadcrumbType[]
          const _paths: TypesBase.IBreadcrumbType[] = []
          val.forEach(key => {
            const item = _data.find((sub: TypesBase.IBreadcrumbType) => sub._id === key)
            if (item) {
              _paths.push(item)
            }
          })
          breadcrumbs.value = _paths
        })
      } else {
        breadcrumbs.value = []
      }
    })
    getList()

    const calcDropPosition = (data : CalcDropPositionType) => {
      const { clientX, clientY, left, top, width, height, startClientX, dragIndex, dropIndex } = data
      // const dragItem = list.value[dragIndex]
      const dropItem = list.value[dropIndex]
      let dropPosition: DropPositionType = 0
      if (dropItem.type === TypesBase.IBaseTypesType.FILE) {
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
      oldList: TypesBook.IBookType[], 
      list: TypesBook.IBookType[]
    }) => {
      const { dragIndex, dropIndex, dropPosition, oldList, list } = data
      const dragItem = oldList[dragIndex]
      const dropItem = oldList[dropIndex]
      if (dropPosition === 0) { // 转移目录
        const _directory = [...dropItem.directory]
        _directory.push(dropItem._id)
        bookStore.bookMove({ id: dragItem._id, directory: _directory }).then(_ => {
          getList()
        }).catch(err => {
          msg.error(err.message)
        })
      } else { // 排序
        const _order = dropItem.order + dropPosition
        bookStore.bookOrder({ id: dragItem._id, order: _order }).then(_ => {
          getList()
        }).catch(err => {
          msg.error(err.message)
        })
      }
    }

    const breadcrumbClick = (item: TypesBase.IBreadcrumbType) => {
      const _directory = [...item.directory]
      _directory.push(item._id)
      directory.value = _directory
    }

    const tempIndex = ref(-1)
    const contextmenuHandler = (event: Event) => {
      const target = event.target as HTMLElement
      const _item = target.closest('.item') as HTMLElement
      if (_item && _item.dataset) {
        tempIndex.value = Number(_item.dataset.index)
      } else {
        tempIndex.value = -1
      }
    }
    
    const copyHandler = () => {
      const item = list.value[tempIndex.value]
      if (item) {
        clipboard.value = {...item}
        clipboardType.value = TypesBase.IClipboardType.COPY
      }
    }
    const cutHandler = () => {
      const item = list.value[tempIndex.value]
      if (item) {
        clipboard.value = {...item}
        clipboardType.value = TypesBase.IClipboardType.CUT
      }
    }
    const pasteHandler = () => {
      if (clipboard.value?._id) {
        switch (clipboardType.value) {
          case TypesBase.IClipboardType.CUT: {
            bookStore.bookMove({
              id: clipboard.value._id, 
              directory: [...directory.value]
            }).then(_ => {
              clipboard.value = null
              clipboardType.value = TypesBase.IClipboardType.NONE
              getList()
            }).catch(err => {
              msg.error(err.message)
            })
            break
          }
          case TypesBase.IClipboardType.COPY: {
            const postData = {
              id: clipboard.value._id, 
              directory: [...directory.value]
            }
            bookStore.bookCopy(postData).then(_ => {
              clipboard.value = null
              clipboardType.value = TypesBase.IClipboardType.NONE
              getList()
            }).catch(err => {
              msg.error(err.message)
            })
            break
          }
        }
      }
    }

    return {
      currentId,
      breadcrumbs,
      dayjs,
      keyword,
      directory,

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
      breadcrumbClick,

      contextmenuHandler,
      copyHandler,
      cutHandler,
      pasteHandler,
      tempIndex,
      clipboard
    }
  }
})
</script>
