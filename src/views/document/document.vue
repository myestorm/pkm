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
              <pkm-tooltip content="列表视图" position="bottom">
                <pkm-button size="small">
                  <template #icon><icon-storage /></template>
                </pkm-button>
              </pkm-tooltip>
              <pkm-tooltip content="目录视图" position="bottom">
                <pkm-button size="small">
                  <template #icon><icon-menu /></template>
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
                  <pkm-doption class="pkm-more-doption">
                    <template #icon>
                      <icon-edit />
                    </template>
                    编辑
                  </pkm-doption>
                  <pkm-doption class="pkm-more-doption">
                    <template #icon>
                      <icon-delete />
                    </template>
                    删除
                  </pkm-doption>
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
                <div class="link" @click="linkTo(item._id)">
                  <div class="item-title">
                    <h3>{{ item.title }}</h3>
                    <span class="date">
                      {{ formatDate(item.createdAt) }}
                    </span>
                  </div>
                  <p class="desc">
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
                      <pkm-doption class="pkm-more-doption">
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
              <pkm-form-item field="title" label="文档名称" :rules="rules">
                <pkm-input v-model="form.title" placeholder="请输入文档名称" />
              </pkm-form-item>
              <pkm-form-item field="desc" label="文档简介" :rules="rules">
                <pkm-textarea v-model="form.desc" placeholder="请输入文档简介" :max-length="200" show-word-limit />
              </pkm-form-item>
              <pkm-form-item field="tags" label="文档标签" :rules="rules">
                <pkm-input-tag v-model="form.tags" placeholder="请输入文档标签" :max-tag-count="3" allow-clear/>
              </pkm-form-item>
              <pkm-form-item field="thumb" label="封面图片">
                <pkm-upload
                  list-type="picture-card"
                  action="/"
                  :default-file-list="fileList"
                  @preview="onPreview"
                />
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
import { defineComponent, ref, reactive, getCurrentInstance, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { FormInstance } from '@arco-design/web-vue/es/form'
import dayjs from 'dayjs'

import { useStore  } from '../../store'
import MarkdownEditor from '../../components/editor/markdown-editor.vue'
import { IKnowledgeType, IKnowledgeDocType } from '../../../app/types/knowledge'

export default defineComponent({
  components: {
    MarkdownEditor
  },
  setup () {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const app = getCurrentInstance()
    const msg = app?.appContext.config.globalProperties.$message
    const { kid = '', did = '' } = route.params
    const _kid = ref(kid)
    const _did = ref(did)
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
        store.dispatch('knowledge/getInfo', { id: kid, hasChildren: 1 }).then((res) => {
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
      kid: _kid.value.toString(),
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
        form.kid = _kid.value.toString()
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
    const createEmptyDocument = () => {
      createDocument({
        kid: _kid.value.toString(),
        title: '新文档'
      }).then(res => {
        pageInfo.children?.unshift(res)
        router.push(`/document/${_kid.value}/${res._id}`)
      }).catch(err => {
        msg.error(err.message)
      })
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
      posting.value = true
      updateDocument(postData).then((res) => {
        if (pageInfo && pageInfo.children) {
          const index = pageInfo.children.findIndex(item => item._id === postData._id)
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

    const linkTo = (id: string) => {
      router.push(`/document/${_kid.value}/${id}`)
    }
    

    const init = (_id: string, _cid?: string) => {
      getKnowledgeInfo(_id).then(() => {
        if (_cid) {
          setCurrent(_cid)
        }
      })
    }
    init(_kid.value.toString(), _did.value.toString())

    watch(
      () => route.params,
      (newParams) => {
        const { kid, did } = newParams
        if (kid && did) {
          if (kid !== _kid.value) {
            init(kid.toString(), did.toString())
            _kid.value = kid
            _did.value = did
          } else {
            if (did !== _did.value) {
              setCurrent(did.toString())
              _did.value = did
            }
          }
        } else if (kid) {
          if (kid !== _kid.value) {
            init(kid.toString())
            current.value = 0
            _kid.value = kid
            _did.value = ''
          }
        }
      }
    )

    
    
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
      _kid,
      _did,
      linkTo
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
