<template>
  <pkm-layout class="document-layout">
    <pkm-layout-sider class="document-layout-sider">
      <pkm-layout class="document-layout-sider-layout">
        <pkm-layout-header class="document-layout-sider-layout-header">
          <div class="title">
            <h2 class="arco-typography">前端学习笔记</h2>
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
            <pkm-spin dot />
            <ul>
              <li class="item arco-link arco-link-status-normal" v-for="i in 30" :key="i" :class="[ i == 1 ? 'current' : '']" @click="getDetail(i)">
                <div class="item-title">
                  <h3>道教常识 - {{i}}</h3>
                  <span class="date">
                    2021-12-6
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
                  </div>
                </div>
                <p class="desc">
                  元始天尊（也称玉清大帝、天宝君全称玉清圣境虚无自然原始天尊)灵宝天尊（也称太上大道君,上清大帝、灵宝君等）...
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
              <pkm-form-item field="name" label="文档名称" :rules="rules">
                <pkm-input v-model="form.name" placeholder="请输入文档名称" />
              </pkm-form-item>
              <pkm-form-item field="name" label="所属目录" :rules="rules">
                <pkm-cascader :options="options" :style="{width:'320px'}" placeholder="请选择所属目录" allow-search/>
              </pkm-form-item>
              <pkm-form-item field="name" label="文档简介" :rules="rules">
                <pkm-textarea placeholder="请输入文档简介" :max-length="200" show-word-limit />
              </pkm-form-item>
              <pkm-form-item field="name" label="文档标签" :rules="rules">
                <pkm-input-tag :default-value="['one','two','three','four']" :style="{width:'380px'}" placeholder="请输入文档标签" :max-tag-count="3" allow-clear/>
              </pkm-form-item>
              <pkm-form-item field="post" label="封面图片">
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
              <pkm-form-item field="isRead">
                <pkm-checkbox v-model="form.isRead">
                前台是否可见
                </pkm-checkbox>
              </pkm-form-item>
            </pkm-form>
          </pkm-drawer>
        </template>
      </markdown-editor>
    </pkm-layout-content>
  </pkm-layout>
</template>
<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import MarkdownEditor from '../../components/editor/markdown-editor.vue'

import { ApiDocuments, ApiDocumentId } from '../../apis/index'
import { IDocumentListItemType, IDocumentListQueryType } from '../../../app/types/document'

export default defineComponent({
  components: {
    MarkdownEditor
  },
  setup () {
    const value = ref('')
    const form = reactive({
      name: '',
      post: '',
      isRead: false,
    })
    // const getList = (params: IDocumentListQueryType) => {
    //   ApiDocuments(params).then(res => {
    //     if (list.value.length > 0) {
    //       list.value = [
    //         ...list.value,
    //         ... res.data.list
    //       ]
    //     } else {
    //       list.value = res.data.list
    //     }
    //     isLast.value = (res.data.page * res.data.pagesize) >= res.data.total
    //     page.value = Number(res.data.page)
    //     pagesize.value = Number(res.data.pagesize)
    //   }).finally(() => {
    //     loading.value = false
    //   })
    // }
    const getDetail = (id: number) => {
      ApiDocumentId(id).then(res => {
        value.value = res.data.content
      })
    }
    return {
      value,
      form,
      getDetail
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
