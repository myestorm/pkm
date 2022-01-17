<template>
  <div class="book">
    <pkm-page-header title="书架" subtitle="存放已买已读已听的书，省得每次买重复了">
      <template #extra>
        <pkm-input-search v-model="keyword" :style="{ width: '320px' }" placeholder="搜索" @press-enter="handleSearch" @clear="handleClear" allow-clear searchLoading />
      </template>
    </pkm-page-header>
    <div class="tabs">
      <pkm-spin :loading="loading" style="width: 100%; min-height: 50vh;">
        <pkm-tabs default-active-key="" v-model="activeKey" activeTab class="pkm-page-tabs">
          <template #extra>
            <div class="pkm-tabs-extra-btn-group">
              <pkm-button type="primary" @click="addGroupHandler">
                <template #icon>
                  <icon-plus />
                </template>
                <template #default>新增分类</template>
              </pkm-button>
            </div>
          </template>
          <pkm-tab-pane v-for="(item, index) in list" :key="item._id" :title="item.title">

            <template #title>
              <div class="pkm-tabs-title">
                {{ item.title }} ({{ item.children.length }})
                <pkm-dropdown position="br" class="pkm-more-dropdown">
                  <pkm-button size="mini" class="no-bg" @click.stop>
                    <template #icon>
                      <icon-more-vertical />
                    </template>
                  </pkm-button>
                  <template #content>
                    <pkm-doption class="pkm-more-doption" @click="editGroupHandler(index, item)"><icon-edit /> 编辑</pkm-doption>
                    <pkm-doption class="pkm-more-doption" @click="delGroupHandler(item._id)"><icon-delete /> 删除</pkm-doption>
                  </template>
                </pkm-dropdown>
              </div>
            </template>
            
            <pkm-row class="grid" :gutter="[24, 24]">
              <pkm-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6" :xxl="4">
                <div class="pkm-book-list-item">
                  <pkm-button type="dashed" long  @click="addBookHandler(item._id)" class="add-btn">
                    <template #icon>
                      <icon-plus />
                    </template>
                    <template #default>新增书籍</template>
                  </pkm-button>
                </div>
              </pkm-col>
              <pkm-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6" :xxl="4" v-for="(book, subIndex) in item.children" :key="subIndex">
                <div class="pkm-book-list-item">
                  <div class="image" :style="{
                    backgroundImage: `url(${book.cover || 'some-error.png'})`
                  }"></div>
                  <h4>{{book.title}}</h4>
                  <div class="actions">
                    <pkm-button type="text" @click="infoBookHandler(item._id, book._id)">
                      <template #icon>
                        <icon-eye />
                      </template>
                    </pkm-button>
                    <pkm-button type="text" @click="eidtBookHandler(item._id, book)">
                      <template #icon>
                        <icon-edit />
                      </template>
                    </pkm-button>
                    <pkm-popconfirm content="确定要删除这条数据?" @ok="deleteBookHandler(item._id, book._id)">
                      <pkm-button type="text">
                        <template #icon>
                          <icon-delete />
                        </template>
                      </pkm-button>
                    </pkm-popconfirm>
                  </div>
                </div>
              </pkm-col>
            </pkm-row>
            
          </pkm-tab-pane>
        </pkm-tabs>
      </pkm-spin>
    </div>

    <pkm-drawer :width="468" :visible="drawerGroupVisible" :ok-loading="groupPosting" @ok="saveGroupHandler" @cancel="hideGroupDrawer" unmountOnClose>
      <template #title>
        分类信息
      </template>
      <pkm-form ref="formGroupRef" :model="formGroup" label-align="right">
        <pkm-form-item field="title" label="分类名称" required :rules="[{ required: true, message: '请填写分类名称'}]">
          <pkm-input v-model="formGroup.title" placeholder="请填写分类名称" :max-length="12" show-word-limit />
        </pkm-form-item>
        <pkm-form-item field="desc" label="分类简介" required :rules="[{ required: true, message: '请填写分类简介'}]">
          <pkm-textarea v-model="formGroup.desc" placeholder="请填写分类简介" :max-length="200" show-word-limit />
        </pkm-form-item>
      </pkm-form>
    </pkm-drawer>

    <pkm-drawer :width="600" :visible="drawerFormVisible" :ok-loading="posting" @ok="saveBookHandler" @cancel="hideFormDrawer" unmountOnClose>
      <template #title>
        书籍信息
      </template>
      <pkm-form ref="formRef" :model="form" label-align="right" :label-col-props="{ span: 3 }" :wrapper-col-props="{ span: 21 }">
        <pkm-form-item field="title" label="名称" required :rules="[{ required: true, message: '请填写名称'}]">
          <pkm-input v-model="form.title" placeholder="请填写名称" />
        </pkm-form-item>
        <pkm-form-item field="author" label="作者">
          <pkm-input v-model="form.author" placeholder="请填写作者" />
        </pkm-form-item>
        <pkm-form-item field="desc" label="简介">
          <pkm-textarea v-model="form.desc" placeholder="请填写简介" :max-length="800" show-word-limit />
        </pkm-form-item>
        <pkm-form-item field="ISBN" label="ISBN">
          <pkm-input v-model="form.ISBN" placeholder="请填写ISBN" />
        </pkm-form-item>
        <pkm-form-item field="cover" label="封面">
          <upload-image v-model="form.cover" />
        </pkm-form-item>
        <pkm-form-item field="tags" label="标签">
          <pkm-input-tag v-model="form.tags" placeholder="请填写标签" :max-tag-count="3" allow-clear/>
        </pkm-form-item>
        <pkm-form-item field="readed" label="状态">
          <pkm-space>
            <pkm-checkbox v-model="form.readed">已读</pkm-checkbox>
            <pkm-checkbox v-model="form.heard">已听</pkm-checkbox>
            <pkm-checkbox v-model="form.purchased">已买</pkm-checkbox>
          </pkm-space>
        </pkm-form-item>
        <pkm-form-item field="rating" label="评价">
          <pkm-rate v-model="form.rating" allow-half allow-clear />
        </pkm-form-item>
      </pkm-form>
    </pkm-drawer>

  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, computed, getCurrentInstance } from 'vue'
import { FormInstance, } from '@arco-design/web-vue/es/form'
import { ValidatedError } from '@arco-design/web-vue/es/form/interface'

import { useStore  } from '../../store'
import { useRouter } from 'vue-router'

import UploadImage from '../../components/upload/upload-image.vue'

import {
  IBookrackGroupType,
  IBookType,
  IApisBookrackGroupUpdateType,
  IApisBookUpdateType
} from '../../../types/bookrack'

export default defineComponent({
  name: 'Book',
  components: {
    UploadImage
  },
  setup () {
    // global
    const store = useStore()
    const router = useRouter()
    const app = getCurrentInstance()
    const modal = app?.appContext.config.globalProperties.$modal
    const msg = app?.appContext.config.globalProperties.$message

    // list
    const activeKey = ref<string>('')
    const list = ref<IBookrackGroupType[]>([])
    const allList = ref<IBookrackGroupType[]>([])
    const loading = ref<boolean>(false)
    const getList = () => {
      loading.value = true
      store.dispatch('bookrack/bookrackList').then(res => {
        list.value = [...res] || []
        allList.value = [...res] || []
      }).catch(err => {
        msg.error(err.message)
      }).then(() => {
        loading.value = false
      })
    }
    getList()
    
    // add group
    const groupPosting = ref(false)
    const formGroupRef = ref<FormInstance | null>(null)
    const drawerGroupVisible = ref(false)
    const formGroupDefault = {
      _id: '',
      title: '',
      desc: ''
    }
    let formGroup = reactive<IApisBookrackGroupUpdateType>({
      ...formGroupDefault
    })
    const hideGroupDrawer = () => {
      drawerGroupVisible.value = false
    }
    const showGroupDrawer = () => {
      drawerGroupVisible.value = true
    }
    const saveGroupHandler = () => {
      formGroupRef.value?.validate((errors: undefined | Record<string, ValidatedError>) => {
        if (!errors) {
          groupPosting.value = true
          const url = formGroup?._id ? 'bookrack/bookrackUpdate' : 'bookrack/bookrackAdd'
          const postData = {
            ...formGroup
          }
          if (!postData._id) {
            delete postData._id
          }
          store.dispatch(url, postData).then(() => {
            hideGroupDrawer()
            getList()
          }).catch(err => {
            msg.error(err.message)
          }).then(() => {
            groupPosting.value = false
          })
        }
      })
    }
    const addGroupHandler = () => {
      formGroup._id = formGroupDefault._id
      formGroup.title = formGroupDefault.title
      formGroup.desc = formGroupDefault.desc
      showGroupDrawer()
    }
    const editGroupHandler = (index: number, data: IApisBookrackGroupUpdateType) => {
      formGroup._id = data._id
      formGroup.title = data.title
      formGroup.desc = data.desc
      showGroupDrawer()
    }
    const delGroupHandler = (id: string) => {
      modal.open({
        title: '系统提示',
        content: `该操作会删除分类，并清空内容，是否继续？`,
        hideCancel: false,
        simple: true,
        modalClass: ['pkm-modal-simple'],
        onOk () {
          store.dispatch('bookrack/bookrackDelete', id).then(() => {
            getList()
          }).catch(err => {
            msg.error(err.message)
          })
        }
      })
    }

    // add book
    const posting = ref(false)
    const formRef = ref<FormInstance | null>(null)
    const drawerFormVisible = ref(false)
    const formDefault = {
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
      rating: 3
    }
    let form = reactive<IApisBookUpdateType>({
      ...formDefault
    })
    const hideFormDrawer = () => {
      drawerFormVisible.value = false
    }
    const showFormDrawer = () => {
      drawerFormVisible.value = true
    }
    const assignBook = (groupId: string, data: IApisBookUpdateType) => {
      form._id = data._id
      form.groupId = groupId
      form.title = data.title
      form.author = data.author
      form.cover = data.cover
      form.desc = data.desc
      form.readed = data.readed
      form.heard = data.heard
      form.purchased = data.purchased
      form.ISBN = data.ISBN
      form.tags = data.tags
      form.rating = data.rating
    }
    const addBookHandler = (groupId: string) => {
      if (groupId) {
        assignBook(groupId, formDefault)
        showFormDrawer()
      }
    }
    const eidtBookHandler = (groupId: string, data: IBookType) => {
      if (groupId) {
        assignBook(groupId, data)
        showFormDrawer()
      }
    }
    const deleteBookHandler = (groupId: string, id: string) => {
      if (groupId && id) {
        store.dispatch('bookrack/bookRemove', {
          groupId: groupId,
          id: id
        }).then(() => {
          getList()
        }).catch(err => {
          msg.error(err.message)
        })
      }
    }
    const infoBookHandler = (groupId: string, id: string) => {
      if (groupId && id) {
        router.push(`/book/info/${groupId}/${id}`)
      }
    }
    const saveBookHandler = () => {
      formRef.value?.validate((errors: undefined | Record<string, ValidatedError>) => {
        if (!errors) {
          posting.value = true
          const url = form?._id ? 'bookrack/bookUpdate' : 'bookrack/bookAdd'
          const postData = {
            ...form
          }
          if (!postData._id) {
            delete postData._id
          }
          store.dispatch(url, postData).then(() => {
            hideFormDrawer()
            getList()
          }).catch(err => {
            msg.error(err.message)
          }).then(() => {
            posting.value = false
          })
        }
      })
    }

    // 搜索
    const keyword = ref<string>('')
    const searchLoading = ref<Boolean>(false)
    const handleSearch = () => {
      if (keyword.value) {
        const _allList: IBookrackGroupType[] = JSON.parse(JSON.stringify(allList.value))
        searchLoading.value = true
        const res: IBookrackGroupType[] = []
        _allList.forEach(item => {
          let children = [...item.children]
          children = children.filter(sub => new RegExp(keyword.value, 'gmi').test(sub.title))
          item.children = [...children]
          res.push(item)
        })
        list.value = [...res]
      } else {
        list.value = JSON.parse(JSON.stringify(allList.value))
      }
      searchLoading.value = false
    }

    const handleClear = () => {
      list.value = JSON.parse(JSON.stringify(allList.value))
    }
    
    return {
      list,
      loading,
      activeKey,

      groupPosting,
      formGroupRef,
      drawerGroupVisible,
      formGroup,
      hideGroupDrawer,
      showGroupDrawer,
      saveGroupHandler,
      addGroupHandler,
      editGroupHandler,
      delGroupHandler,

      formRef,
      form,
      drawerFormVisible,
      posting,
      hideFormDrawer,
      showFormDrawer,
      saveBookHandler,
      addBookHandler,
      eidtBookHandler,
      deleteBookHandler,
      infoBookHandler,
      
      keyword,
      searchLoading,
      handleSearch,
      handleClear
    }
  }
})
</script>
<style lang="scss" scoped>
.book {
  padding: 8px 0;
}
.tabs {
  padding: 0 32px;
}
.grid {
  align-items: stretch;
}
.no-bg {
  background-color: transparent;
  &:hover {
    color: #ffffff;
  }
}
.pkm-tabs-extra-btn-group {
  height: 32px;
  padding-bottom: 12px;
}
</style>
