<template>
  <pkm-layout class="document-layout">
    <pkm-layout-sider class="document-layout-sider">
      <pkm-layout class="document-layout-sider-layout">
        <pkm-layout-header class="document-layout-sider-layout-header">
          <div class="title">
            <h2 class="arco-typography">{{ knowledgeInfo.title }}</h2>
            <pkm-button type="primary" shape="circle" size="small">
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
              <li class="item arco-link arco-link-status-normal" v-for="(item, index) in docList" :key="index" :class="[ index == 1 ? 'current' : '']" @click="setDetail(item)">
                <div class="item-title">
                  <h3>{{ item.title }}</h3>
                  <span class="date">
                    {{ formatDate(item.createdAt) }}
                  </span>
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
                </div>
                <p class="desc">
                  {{ item.desc }}...
                </p>
              </li>
            </ul>
          </div>
        </pkm-layout-content>
      </pkm-layout>
    </pkm-layout-sider>
    <pkm-layout-content>
      <markdown-editor v-model:value="value" @infoClick="infoHandleClick">
        <template #info>
          <pkm-drawer :width="600" :visible="infoVisible" @ok="infoHandleOk" @cancel="infoHandleCancel" unmountOnClose>
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
                <pkm-input-tag :default-value="['one','two','three','four']" :style="{width:'380px'}" placeholder="请输入文档标签" :max-tag-count="3" allow-clear/>
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
                  placeholder="请选择发布时间"
                  style="width: 220px; margin: 0 24px 24px 0;"
                  show-time
                  format="YYYY-MM-DD hh:mm"
                  @change="onChange"
                  @select="onSelect"
                  @ok="onOk"
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
import { useStore  } from '../../store'

import MarkdownEditor from '../../components/editor/markdown-editor.vue'
import dayjs from 'dayjs'
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
    const loading = ref(false)

    const knowledgeInfo = reactive<IKnowledgeType>({
      title: ''
    })

    const getKnowledgeInfo = (kid: string) => {
      return store.dispatch('knowledge/getInfo', kid).then((res) => {
        knowledgeInfo.title = res.title
        store.commit('knowledge/setSelected', res)
      }).catch(err => {
        msg.error(err.message)
      })
    }

    const docList = ref<IKnowledgeDocType[]>([])
    const getDocList = (kid: string) => {
      return store.dispatch('knowledge/getDocsByid', kid).then((res) => {
        docList.value = res
      }).catch(err => {
        msg.error(err.message)
      })
    }

    const init = (_id: string | string[]) => {
      if (_id && typeof _id === 'string') {
        loading.value = true
        Promise.all([getKnowledgeInfo(_id), getDocList(_id)]).finally(() => {
          loading.value = false
        })
      }
    }
    init(kid)

    watch(
      () => route.params,
      (newParams) => {
        init(newParams.kid)
      }
    )

    const formatDate = (str: any) => {
      return dayjs(str).format('MM-DD-YYYY')
    }

    const value = ref('')
    const setDetail = (data: IKnowledgeDocType) => {
      value.value = data.content || ''
    }
    const form = reactive<IKnowledgeDocType>({
      title: '',
      desc: '',
      createdAt: new Date(),
      thumb: '',
      content: ''
    })
    
    return {
      loading,
      knowledgeInfo,
      docList,
      formatDate,
      value,
      form,
      setDetail
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
      color: var(--color-text-3);
      padding: 8px 12px;
      border-left: 2px transparent solid;
      &-title {
        display: flex;
        align-items: center;
        padding-bottom: 4px;
        h3 {
          flex: 1;
          color: var(--color-text-2)
        }
        .date {
          font-size: 12px;
          color: var(--color-fill-4)
        }
        .action {
          margin-left: 16px;
        }
      }
      .desc {
        color: var(--color-text-3)
      }
      &.current {
        background-color: var(--color-fill-1);
        border-color: $--primary-color;
      }
    }
  }
}
</style>
