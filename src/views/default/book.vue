<template>
  <pkm-spin dot :loading="loading" class="pkm-totonoo-page-loading">
    <pkm-layout class="pkm-totonoo-file">
      <pkm-layout-sider class="pkm-totonoo-file-sider">
        <pkm-space direction="vertical" fill class="header">
          <add-button @change="addBtnChangeHandler">
            <pkm-doption value="file">
              <template #icon>
                <icon-file />
              </template>
              <template #default>
                <span class="name">书籍</span>
              </template>
            </pkm-doption>
            <pkm-doption value="folder">
              <template #icon>
                <icon-folder />
              </template>
              <template #default>
                <span class="name">目录</span>
              </template>
            </pkm-doption>
          </add-button>
          <div class="pkm-totonoo-flex">
            <pkm-button type="outline" class="backto" size="mini" :disabled="paths.length == 0" @click="backToHandler">
              <template #icon>
                <icon-left />
              </template>
            </pkm-button>
            <pkm-breadcrumb flex="auto" :max-count="3" :style="{ fontSize: `14px` }">
              <pkm-breadcrumb-item>
                <router-link to="/book"><icon-folder /></router-link>
              </pkm-breadcrumb-item>
              <pkm-breadcrumb-item v-for="item in breadcrumbs" :key="item.url">
                <router-link :to="`/book/${item.url}`">{{ item.title }}</router-link>
              </pkm-breadcrumb-item>
              <template #separator>
                <icon-right />
              </template>
            </pkm-breadcrumb>
          </div>
          <pkm-input-search v-model="keyword" class="search-input" placeholder="试试搜索书籍" :allow-clear="true" :loading=" searchLoading" @input="searchHandler" @search="searchHandler" @clear="searchClear" />
        </pkm-space>
        <div class="pkm-totonoo-file-list">
          <pkm-dropdown trigger="contextMenu" alignPoint class="pkm-totonoo-contextmenu-dropdown">
            <totonoo-drag-sort
              class="contextmenu-dropdown"
              v-model="list"
              :calcDropPosition="sortcalcDropPosition" 
              @end="sortDragEndHandler"
              @contextmenu="sortContextmenuHandler($event)"
            >
              <template #default="{ item, index }">
                <div class="item" :data-index="index" :key="item.id" :class="[item.id == currentId ? 'current' : '', index % 2 == 0 ? 'odd' : '']">
                  <div class="icon" :class="[item.type == 'file' ? 'icon-image' : '']" @click="sortItemClick(item)">
                    <img :alt="item.title" :src="item.cover" v-if="item.type == 'file'">
                    <icon-folder :size="24" :strokeWidth="2" v-else />
                  </div>
                  <div class="info" @click="sortItemClick(item)">
                    <div class="title" :title="item.title">{{ subStr(item.title, 16) }}</div>
                    <div class="author" :title="item.author">{{ subStr(item.author, 16) }}</div>
                    <div class="desc">{{ subStr(item.desc, 54) }}</div>
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
                        <pkm-doption @click="sortEditHandler(item.id)">
                          <template #icon>
                            <icon-edit />
                          </template>
                          编辑
                        </pkm-doption>
                        <pkm-doption @click="sortRemoveHandler(item.id)">
                          <template #icon>
                            <icon-delete />
                          </template>
                          删除
                        </pkm-doption>
                        <pkm-doption @click="sortTopHandler(item.id, !item.top, index)">
                          <template #icon>
                            <icon-star-fill v-if="item.top" />
                            <icon-star v-else />
                          </template>
                          <template v-if="item.top">取消推荐</template>
                          <template v-else>推荐</template>
                        </pkm-doption>
                      </template>
                    </pkm-dropdown>
                  </div>
                </div>
              </template>
            </totonoo-drag-sort>
            <template #content>
              <pkm-dgroup title="操作">
                <pkm-doption @click="copyHandler" :disabled="sortContextmenuIndex == -1">
                  <template #icon>
                    <icon-copy />
                  </template>
                  <template #default>
                    复制
                  </template>
                </pkm-doption>
                <pkm-doption @click="cutHandler" :disabled="sortContextmenuIndex == -1">
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
                    书籍
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
      <pkm-layout-content class="pkm-totonoo-file-content">
        <book-info v-if="pageInfo.id != ''" :data="pageInfo" @edit="bookInfoEditHandler" @update="bookInfoUpdateHandler" />
      </pkm-layout-content>
    </pkm-layout>
  </pkm-spin>
  <form-drawer v-model="formDrawerVisible" :type="formDrawerType" :id="formDrawerId" :directory="formDrawerDirectory" @done="formDrawerDone" />
</template>
<script lang="ts">
import { defineComponent, ref, watch, getCurrentInstance } from 'vue'
import AddButton from '@/components/add-button/index.vue'
import TotonooDragSort, { CalcDropPositionType, DropPositionType } from '@/components/totonoo-drag-sort/index.vue'
import FormDrawer from '@/views/components/book/form-drawer.vue'
import BookInfo from '@/views/components/book/info.vue'

import { subStr } from '@/utils/index'
import { useRoute, useRouter } from 'vue-router'

import useBookStore from '@/store/book/index'
import * as TypesBase from '@/types/base'
import * as TypesBook from '@/types/book'

export default defineComponent({
  components: {
    AddButton,
    FormDrawer,
    TotonooDragSort,
    BookInfo
  },
  setup () {
    const app = getCurrentInstance()
    const msg = app?.appContext.config.globalProperties.$message
    const modal = app?.appContext.config.globalProperties.$modal
    const dayjs = app?.appContext.config.globalProperties.$dayjs
    const router = useRouter()
    const route = useRoute()
    const bookStore = useBookStore()
    const paths = ref<string[]>((route.params.path || []) as string[])
    const currentId = ref<string>(paths.value[paths.value.length - 1] || '')
    const loading = ref(false)
    const list = ref<TypesBook.IBookType[]>([])
    const breadcrumbs = ref<TypesBase.INavigationType[]>([])
    const pageInfo = ref<TypesBook.IBookType>({
      ...bookStore.getBookDefault
    })
    const editorValue = ref('')
    const keyword = ref('')
    const searchLoading = ref(false)
    
    const getList = () => {
      loading.value = true
      bookStore.bookList({
        directory: paths.value
      }).then(res => {
        list.value = res.data
      }).catch(_ => {
        list.value = []
      }).finally(() => {
        loading.value = false
      })
    }
    const updatePageInfo = () => {
      if (currentId.value && currentId.value === pageInfo.value.id) {
        bookStore.bookInfo(pageInfo.value.id).then(res => {
          const data = res.data
          const type = data.type
          if (type === TypesBase.IBaseTypesType.FILE) {
            pageInfo.value = {
              ...data
            }
          }
        }).catch(err => {
          msg.error(err.message)
        })
      }
    }
    const linkBook = (_paths: string[]) => {
      router.push(`/book/${_paths.join('/')}`)
    }
    const backToHandler = () => {
      const _paths = [...paths.value]
      _paths.pop()
      linkBook(_paths)
    }

    const formDrawerVisible = ref(false)
    const formDrawerType = ref(TypesBase.IBaseTypesType.FILE)
    const formDrawerId= ref()
    const formDrawerDirectory= ref(paths)
    const addBtnChangeHandler = (val: TypesBase.IBaseTypesType) => {
      formDrawerType.value = val
      formDrawerId.value = ''
      formDrawerVisible.value = true
    }
    const formDrawerDone = () => {
      getList()
      updatePageInfo()
    }

    const sortcalcDropPosition = (data : CalcDropPositionType) => {
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
    const sortDragEndHandler = (data: {
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
        _directory.push(dropItem.id)
        bookStore.bookMove({ id: dragItem.id, directory: _directory }).then(_ => {
          getList()
        }).catch(err => {
          msg.error(err.message)
        })
      } else { // 排序
        const _order = dropItem.order + dropPosition
        bookStore.bookOrder(dragItem.id, _order).then(_ => {
          getList()
        }).catch(err => {
          msg.error(err.message)
        })
      }
    }
    const sortContextmenuIndex = ref(-1)
    const sortContextmenuHandler = (event: Event) => {
      const target = event.target as HTMLElement
      const _item = target.closest('.item') as HTMLElement
      if (_item && _item.dataset) {
        sortContextmenuIndex.value = Number(_item.dataset.index)
      } else {
        sortContextmenuIndex.value = -1
      }
    }
    const sortItemClick = (item: TypesBook.IBookType) => {
      const _directory = [...item.directory]
      const _id = item.id
      _directory.push(_id)
      linkBook(_directory)
    }
    const sortEditHandler = (id: string) => {
      formDrawerId.value = id
      formDrawerVisible.value = true
    }
    const sortRemoveHandler = (id: string) => {
      modal.open({
        title: '系统提示',
        content: `该操作会删除内容，是否继续？`,
        hideCancel: false,
        simple: true,
        modalClass: ['pkm-totonoo-modal-simple'],
        onOk () {
          bookStore.bookRemove(id).then(_ => {
            getList()
          }).catch(err => {
            msg.error(err.message)
          })
        }
      })
    }
    const sortTopHandler = (id: string, top: boolean, index: number) => {
      bookStore.bookTop(id, top).then(() => {
        msg.success('操作成功')
        list.value[index].top = top
      }).catch(err => {
        msg.error(err.message)
      })
    }
    const creatDocument = () => {
      addBtnChangeHandler(TypesBase.IBaseTypesType.FILE)
    }
    const creatFolder = () => {
      addBtnChangeHandler(TypesBase.IBaseTypesType.FOLDER)
    }
    const clipboard = ref<TypesBook.IBookType | null>(null)
    const clipboardType = ref<TypesBase.IClipboardType>(TypesBase.IClipboardType.NONE)
    const copyHandler = () => {
      const item = list.value[sortContextmenuIndex.value]
      if (item) {
        clipboard.value = {...item}
        clipboardType.value = TypesBase.IClipboardType.COPY
      }
    }
    const cutHandler = () => {
      const item = list.value[sortContextmenuIndex.value]
      if (item) {
        clipboard.value = {...item}
        clipboardType.value = TypesBase.IClipboardType.CUT
      }
    }
    const pasteHandler = () => {
      if (clipboard.value?.id) {
        switch (clipboardType.value) {
          case TypesBase.IClipboardType.CUT: {
            bookStore.bookMove({
              id: clipboard.value.id, 
              directory: [...paths.value]
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
              id: clipboard.value.id, 
              directory: [...paths.value]
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

    const searchHandler = () => {
      if (keyword.value) {
        loading.value = true
        const conditions = [...paths.value]
        bookStore.bookSearch(keyword.value, conditions).then(res => {
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

    const bookInfoEditHandler = () => {
      sortEditHandler(pageInfo.value.id)
    }
    const bookInfoUpdateHandler = () => {
      updatePageInfo()
    }

    const mergeBreadcrumbs = (data: TypesBook.IBookType) => {
      const type = data.type
      const _directoryList = [...data.directoryList]
      let _breadcrumbs: TypesBase.INavigationType[] = []
      if (type === TypesBase.IBaseTypesType.FOLDER) {
        _directoryList.push(data)
      }
      _breadcrumbs = _directoryList.map(item => {
        const _directory = [...item.directory]
        _directory.push(item.id)
        const url = _directory.join('/')
        return {
          title: item.title,
          url
        }
      })
      breadcrumbs.value = _breadcrumbs
    }
    const init = () => {
      if (currentId.value) {
        loading.value = true
        bookStore.bookInfo(currentId.value).then(res => {
          const data = res.data
          const type = data.type
          if (type === TypesBase.IBaseTypesType.FILE) {
            paths.value = [...data.directory]
            pageInfo.value = {
              ...data
            }
          }
          mergeBreadcrumbs(data)
          getList()
        }).catch(err => {
          msg.error(err.message)
        }).finally(() => {
          loading.value = false
        })
      } else {
        breadcrumbs.value = []
        getList()
      }
    }
    init()
    watch(
      () => route.params,
      params => {
        const _fullPath = route.fullPath
        if (/^\/book/.test(_fullPath)) {
          const _paths = params.path || []
          paths.value = [..._paths]
          currentId.value = _paths[_paths.length - 1] || ''
          init()
        }
      }
    )
    return {
      paths,
      backToHandler,
      loading,
      list,
      currentId,
      pageInfo,
      editorValue,
      breadcrumbs,

      formDrawerVisible,
      formDrawerType,
      formDrawerId,
      formDrawerDirectory,
      addBtnChangeHandler,
      formDrawerDone,

      sortcalcDropPosition,
      sortDragEndHandler,
      sortContextmenuIndex,
      sortContextmenuHandler,
      sortItemClick,
      sortEditHandler,
      sortRemoveHandler,
      sortTopHandler,
      creatDocument,
      creatFolder,
      clipboard,
      copyHandler,
      cutHandler,
      pasteHandler,

      keyword,
      searchLoading,
      searchHandler,
      searchClear,

      bookInfoEditHandler,
      bookInfoUpdateHandler,

      dayjs,
      subStr
    }
  }
})
</script>
