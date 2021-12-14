<template>
  <pkm-layout class="document-layout" :loading="loading">
    <pkm-layout-sider class="document-layout-sider">
      <pkm-layout class="document-layout-sider-layout">
        <pkm-layout-header class="document-layout-sider-layout-header">
          <div class="title">
            <h2 class="arco-typography">{{ pageInfo.title }}</h2>
            <pkm-button type="primary" shape="circle" size="small" @click="createEmptyDocument">
              <template #icon>
                <icon-plus />
              </template>
            </pkm-button>
          </div>
          <div class="toolbar">
            <pkm-space class="l">
              <pkm-tooltip :content="item.text" position="bottom" v-for="item in viewOptions" :key="item.key">
                <pkm-button size="small" :type="currentView == item.key ? 'outline' : 'secondary'" @click="changeView(item.key)">
                  <template #icon>
                    <icon-storage v-if="item.key == 'desc'" />
                    <icon-menu v-else />
                  </template>
                </pkm-button>
              </pkm-tooltip>
            </pkm-space>
            <pkm-space class="r">
              <pkm-dropdown position="br" class="pkm-more-dropdown">
                <pkm-button class="more" size="small">
                  <template #icon>
                    <icon-more />
                  </template>
                </pkm-button>
                <template #content>
                  <pkm-dsubmenu v-for="item in filterOptions" :key="item.key">
                    {{ item.text }}
                    <template #content>
                      <pkm-doption v-for="sub in item.children" :key="sub.key" @click="filter(item.key, sub.key)">
                        <template #icon>
                          <icon-sort-descending v-if="sub.key == 'desc'" />
                          <icon-sort-ascending v-if="sub.key == 'asc'" />
                        </template>
                        {{ sub.text }}
                      </pkm-doption>
                    </template>
                  </pkm-dsubmenu>
                </template>
              </pkm-dropdown>
            </pkm-space>
          </div>
        </pkm-layout-header>
        <pkm-layout-content class="pkm-flex-scroll-container">
          <div class="list scroll-body">
            <div style="padding: 8px 12px;" v-if="loading">
              <pkm-skeleton :animation="true" v-for="i in 4" :key="i" style="margin: 8px 0;">
                <pkm-space direction="vertical" :style="{ width:'100%' }">
                  <pkm-skeleton-line :line-height="12" :line-spacing="8" :rows="3" :widths="[120]" />
                </pkm-space>
              </pkm-skeleton>
            </div>
            <ul v-else>
              <li class="item arco-link arco-link-status-normal" v-for="(item, index) in pageInfo.children" :key="item._id" :class="[ (index === current) ? 'current' : '']">
                <div class="link" @click="linkTo(item._id || '')">
                  <div class="item-title">
                    <h3>{{ item.title }}</h3>
                    <span class="date">
                      {{ formatDate(item.createdAt) }}
                    </span>
                  </div>
                  <p class="desc" v-show="currentView == 'desc'">
                    {{ item.desc }}...
                  </p>
                </div>
                <div class="action">
                  <pkm-dropdown position="br" class="pkm-more-dropdown">
                    <pkm-button size="mini" class="more">
                      <template #icon>
                        <icon-more-vertical />
                      </template>
                    </pkm-button>
                    <template #content>
                      <pkm-doption class="pkm-more-doption" @click="removeDoc(item._id || '')">
                        <template #icon>
                          <icon-delete />
                        </template>
                        删除
                      </pkm-doption>
                      <pkm-doption class="pkm-more-doption" @click="setTransferId(item._id || '')">
                        <template #icon>
                          <icon-rotate-right />
                        </template>
                        转移
                      </pkm-doption>
                    </template>
                  </pkm-dropdown>
                </div>
              </li>
            </ul>
            <select-knowledge v-model="visibleSelectKnowledge" title="文档转移" desc="请选择目标知识库" @ok="transferDoc" />
          </div>
        </pkm-layout-content>
      </pkm-layout>
    </pkm-layout-sider>
    <pkm-layout-content>
      <markdown-editor v-model:value="form.content" @infoClick="showDrawer" @editorSave="saveHandler">
        <template #info>
          <pkm-drawer :width="600" :visible="infoVisible" :ok-loading="posting" @ok="saveHandler" @cancel="hideDrawer" unmountOnClose>
            <template #title>
              文档信息
            </template>
            <pkm-form ref="formRef" :model="form" label-align="left">
              <pkm-form-item field="title" label="文档名称">
                <pkm-input v-model="form.title" placeholder="请输入文档名称" />
              </pkm-form-item>
              <pkm-form-item field="desc" label="文档简介">
                <pkm-textarea v-model="form.desc" placeholder="请输入文档简介" :max-length="200" show-word-limit />
              </pkm-form-item>
              <pkm-form-item field="tags" label="文档标签">
                <pkm-input-tag v-model="form.tags" placeholder="请输入文档标签" :max-tag-count="3" allow-clear/>
              </pkm-form-item>
              <pkm-form-item field="thumb" label="封面图片">
                <upload-image v-model="form.thumb" />
              </pkm-form-item>
              <pkm-form-item field="post" label="发布时间">
                <pkm-date-picker
                  v-model="form.publishAt"
                  placeholder="请选择发布时间"
                  show-time
                  format="YYYY-MM-DD hh:mm"
                />
              </pkm-form-item>
            </pkm-form>
          </pkm-drawer>
        </template>
      </markdown-editor>
    </pkm-layout-content>
  </pkm-layout>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, getCurrentInstance, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { FormInstance } from '@arco-design/web-vue/es/form'
import dayjs from 'dayjs'

import { useStore  } from '../../store'
import MarkdownEditor from '../../components/editor/markdown-editor.vue'
import UploadImage from '../../components/upload/upload-image.vue'
import SelectKnowledge from '../../components/select-knowledge/index.vue'
import { IKnowledgeType, IKnowledgeDocType } from '../../../app/types/knowledge'

export default defineComponent({
  components: {
    MarkdownEditor,
    UploadImage,
    SelectKnowledge
  },
  setup () {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const app = getCurrentInstance()
    const msg = app?.appContext.config.globalProperties.$message
    const { kid = '', did = '' } = route.params
    const myKid = ref(kid)
    const myDid = ref(did)
    const loading = ref(false)
    const current = ref(0)

    // 格式化时间
    const formatDate = (str: any) => {
      let _str = dayjs(str).format('YYYY-MM-DD')
      const arr = _str.split('-')
      const year = new Date().getFullYear()
      if (Number(year) === Number(arr[0])) {
        _str = `${arr[1]}-${arr[2]} `
      }
      return _str
    }

    // 获取知识库以及该知识库下的文档
    const pageInfo = reactive<IKnowledgeType>({
      _id: '',
      title: '',
      isDefault: false,
      desc: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      thumb: '',
      children: []
    })
    const getKnowledgeInfo = (id: any) => {
      return new Promise((reslove, reject) => {
        if (!id || typeof id !== 'string') {
          msg.error('参数不正确！')
          return false
        }
        loading.value = true
        store.dispatch('knowledge/getInfo', { id, hasChildren: 1 }).then((res) => {
          pageInfo._id = res._id
          pageInfo.title = res.title
          pageInfo.isDefault = res.isDefault
          pageInfo.desc = res.desc
          pageInfo.createdAt = res.createdAt
          pageInfo.updatedAt = res.updatedAt
          pageInfo.thumb = res.thumb
          pageInfo.children = res.children || []
          store.commit('knowledge/setSelected', {
            _id: res._id,
            title: res.title
          })
          reslove(res)
        }).catch(err => {
          msg.error(err.message)
          reject(err)
        }).finally(() => {
          loading.value = false
        })
      })
    }

    // 文档信息
    type IDocType = IKnowledgeDocType & { kid?: string }
    const form = reactive<IDocType>({
      _id: '',
      kid: myKid.value.toString(),
      title: '',
      desc: '',
      publishAt: new Date(),
      thumb: '',
      content: '',
      tags: []
    })

    const setForm = (data: IKnowledgeDocType | undefined) => {
      if (data) {
        form._id = data._id
        form.kid = myKid.value.toString()
        form.title = data.title
        form.desc = data.desc
        form.publishAt = data.publishAt
        form.thumb = data.thumb
        form.content = data.content
        form.tags = data.tags ? [...data.tags] : []
      }
    }

    const setCurrent = (id: string) => {
      const index = pageInfo.children?.findIndex(item => item._id === id) || 0
      if (pageInfo.children) {
        current.value = index
        setForm(pageInfo.children[index])
      }
    }

    // 创建文档
    const createDocument = (postData: IDocType) => {
      const _postData = {
        ...postData
      }
      delete postData._id
      return store.dispatch('knowledge/addDoc', _postData)
    }
    // 创建空文档
    const createEmptyDocument = async () => {
      if (myKid.value) {
        await createDocument({
          kid: myKid.value.toString(),
          title: '新文档'
        }).then(res => {
          pageInfo.children?.unshift(res)
          router.push(`/document/${myKid.value}/${res._id}`)
        }).catch(err => {
          msg.error(err.message)
        })
      }
    }

    // 修改文档
    const updateDocument = (postData: IDocType) => {
      return store.dispatch('knowledge/updateDoc', postData)
    }
    const posting = ref(false)
    const infoVisible = ref(false)
    const formRef = ref<FormInstance | null>(null)
    const hideDrawer = () => {
      infoVisible.value = false
    }
    const showDrawer = () => {
      infoVisible.value = true
    }
    // 保存正文
    const saveHandler = () => {
      const postData = {
        ...form
      }
      if (postData.kid) {
        posting.value = true
        updateDocument(postData).then((res) => {
          if (pageInfo && pageInfo.children) {
            const index = pageInfo.children.findIndex(item => item._id === res._id)
            if (Number(index) > -1) {
              pageInfo.children[index] = {
                ...res
              }
            }
          }
          hideDrawer()
          msg.success('操作成功')
        }).catch(err => {
          msg.error(err.message)
        }).finally(() => {
          posting.value = false
        })
      }
    }

    const linkTo = (id: string) => {
      router.push(`/document/${myKid.value}/${id}`)
    }

    // 删除文档
    const removeDoc = (id: string) => {
      store.dispatch('knowledge/removeDoc', {
        kid: myKid.value.toString(),
        id
      }).then(() => {
        const index = pageInfo.children?.findIndex(item => item._id === id)
        if (typeof index !== 'undefined') {
          pageInfo.children?.splice(index, 1)
        }
      }).catch(err => {
        msg.error(err.message)
      })
    }
    

    const init = (_id: string, _cid?: string) => {
      getKnowledgeInfo(_id).then(async (res) => {
        if (_cid === 'add') {
          await createEmptyDocument()
        } else {
          let cid = _cid
          if (!_cid && pageInfo && pageInfo?.children && pageInfo?.children[0]) {
            cid = pageInfo.children[0]._id || ''
          }
          if (cid) {
            setCurrent(cid)
          }
        }
      })
    }
    init(myKid.value.toString(), myDid.value.toString())

    watch(
      () => route.params,
      async (newParams) => {
        const { kid, did } = newParams
        if (did === 'add') {
          await createEmptyDocument()
        } else {
          if (kid && did) {
            if (kid !== myKid.value) {
              init(kid.toString(), did.toString())
              myKid.value = kid
              myDid.value = did
            } else {
              if (did !== myDid.value) {
                setCurrent(did.toString())
                myDid.value = did
              }
            }
          } else if (kid) {
            if (kid !== myKid.value) {
              init(kid.toString())
              myKid.value = kid
            }
          }
        }
      }
    )

    // 文档转移
    const visibleSelectKnowledge = ref(false)
    const transferId = ref('')
    const hideSelectKnowledgeDrawer = () => {
      visibleSelectKnowledge.value = false
    }
    const showSelectKnowledgeDrawer = () => {
      visibleSelectKnowledge.value = true
    }
    const transferDoc = (tid: string) => {
      const fid = myKid.value.toString()
      if (tid !== fid) {
        const id = transferId.value
        store.dispatch('knowledge/transferDoc', {
          fid,
          tid,
          id
        }).then(() => {
          const index = pageInfo.children?.findIndex(item => item._id === id)
          if (typeof index !== 'undefined') {
            pageInfo.children?.splice(index, 1)
          }
        }).catch(err => {
          msg.error(err.message)
        })
        hideSelectKnowledgeDrawer()
      }
    }
    const setTransferId = (id: string) => {
      showSelectKnowledgeDrawer()
      transferId.value = id
    }

    // 视图 过滤
    const viewOptions = [
      {
        key: 'desc',
        text: '列表'
      },
      {
        key: 'list',
        text: '目录'
      }
    ]
    const currentView = ref('desc')
    const changeView = (v: string) => {
      currentView.value = v
    }
    enum FilterTypes {
      createdAt = 'createdAt',
      updatedAt = 'updatedAt',
      publishAt = 'publishAt'
    }
    enum OrderTypes {
      desc = 'desc',
      asc = 'asc'
    }
    const filterOptions = [
      {
        key: FilterTypes.createdAt,
        text: '创建时间',
        children: [{
          key: OrderTypes.desc,
          text: '降序'
        }, {
          key: OrderTypes.asc,
          text: '升序'
        }]
      },
      {
        key: FilterTypes.updatedAt,
        text: '更新时间',
        children: [{
          key: OrderTypes.desc,
          text: '降序'
        }, {
          key: OrderTypes.asc,
          text: '升序'
        }]
      },
      {
        key: FilterTypes.publishAt,
        text: '发布时间',
        children: [{
          key: OrderTypes.desc,
          text: '降序'
        }, {
          key: OrderTypes.asc,
          text: '升序'
        }]
      }
    ]
    const filter = (key: FilterTypes, order: OrderTypes) => {
      const ori = pageInfo.children ? [...pageInfo.children] : []
      ori.sort((a: IKnowledgeDocType, b: IKnowledgeDocType) => {
        const aTime = a[key]
        const bTime = b[key]
        const at = Number(dayjs(aTime).valueOf())
        const bt = Number(dayjs(bTime).valueOf())
        return order === OrderTypes.asc ? at - bt : bt - at
      })
      pageInfo.children = [
        ...ori
      ]
    }
    
    return {
      loading,
      formatDate,
      pageInfo,
      current,
      form,
      createEmptyDocument,
      infoVisible,
      formRef,
      posting,
      saveHandler,
      hideDrawer,
      showDrawer,
      setCurrent,
      myKid,
      myDid,
      linkTo,
      removeDoc,
      visibleSelectKnowledge,
      transferDoc,
      setTransferId,
      viewOptions,
      currentView,
      changeView,
      filterOptions,
      filter
    }
  },
})
</script>

<style lang="scss" scoped>
.document-layout, .document-layout-sider, .document-layout-sider-layout {
  width: 100%;
  height: 100%;
}
.document-layout-sider {
  width: 320px !important;
  .title {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    box-shadow: 0 0 1px 0 rgba(0,0,0,0.8);
    min-height: 48px;
    box-sizing: border-box;
    background-color: var(--color-bg-5);
    > h2 {
      @include reset();
      font-size: 16px;
      flex: 1;
    }
  }
  .toolbar {
    background-color: var(--color-bg-4);
    display: flex;
    padding: 8px 12px;
    .l {
      flex: 1;
    }
  }
  .list {
    ul, li, h3, p {
      @include reset();
    }
    .item {
      width: 100%;
      box-sizing: border-box;
      color: var(--color-text-3);
      padding: 8px 12px;
      border-left: 2px transparent solid;
      position: relative;
      &-title {
        display: flex;
        align-items: center;
        padding-bottom: 4px;
        padding-right: 40px;
        h3 {
          flex: 1;
          color: var(--color-text-2)
        }
        .date {
          font-size: 12px;
          color: var(--color-fill-4)
        }
      }
      .desc {
        color: var(--color-text-3)
      }
      .action {
        position: absolute;
        right: 16px;
        top: 8px;
      }
      &.current {
        background-color: var(--color-fill-1);
        border-color: $--primary-color;
      }
    }
  }
}
</style>
