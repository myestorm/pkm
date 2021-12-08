<template>
  <div class="pkm-side-content">
    <div class="pkm-collection-group">
      <div class="title">
        <div class="fold">
          <pkm-button size="mini" shape="circle" @click="collectionsFold = !collectionsFold" :class="[collectionsFold ? '' : 'fold-icon']">
            <template #icon>
              <icon-right />
            </template>
          </pkm-button>
        </div>
        <div class="name" @click="collectionsFold = !collectionsFold">
          个人知识库
        </div>
        <div class="action">
          <pkm-button size="mini" @click="visible = true">
            <template #icon>
              <icon-plus />
            </template>
          </pkm-button>
        </div>
      </div>
      <div class="list" v-show="!collectionsFold">
        {{collections}}
        <pkm-skeleton :animation="true" v-if="collectionsLoading">
          <pkm-space direction="vertical" :style="{ width:'100%' }">
            <pkm-skeleton-line :line-height="12" :line-spacing="8" :rows="3" />
          </pkm-space>
        </pkm-skeleton>
        <ul class="links" v-else>
          <li v-for="(item, index) in collections" :key="item.id" :class="[index == 0 ? 'current' : '' ]">
            <div class="name">
              <router-link :to="`/document/${item._id}`" class="arco-link arco-link-status-normal">{{ item.title }}</router-link>
            </div>
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
          </li>
        </ul>
      </div>
    </div>
    <div class="pkm-collection-group">
      <div class="title">
        <div class="fold">
          <pkm-button size="mini" shape="circle" @click="recyclesFold = !recyclesFold" :class="[recyclesFold ? '' : 'fold-icon']">
            <template #icon>
              <icon-right />
            </template>
          </pkm-button>
        </div>
        <div class="name" @click="recyclesFold = !recyclesFold">
          回收站
        </div>
        <div class="action">
          <pkm-button size="mini">
            <template #icon>
              <icon-delete />
            </template>
          </pkm-button>
        </div>
      </div>
      <div class="list" v-show="!recyclesFold">
        <ul class="links">
          <template v-for="item in recycles" :key="item.groupName">
            <li class="g-title">{{ item.groupName }}</li>
            <li v-for="sub in item.children" :key="sub.id"><pkm-link href="#link" class="name">{{ sub.title }}</pkm-link></li>
          </template>
        </ul>
      </div>
    </div>
    <pkm-drawer
      :width="320"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <template #title>新建知识库</template>
      <pkm-form :model="form">
        <pkm-form-item field="name" label="名称">
          <pkm-input v-model="form.name" placeholder="请输入名称" autofocus />
          <template #help>
            <div>尽量控制在10个汉字以内</div>
          </template>
        </pkm-form-item>
      </pkm-form>
    </pkm-drawer>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, computed } from 'vue'
import { useStore  } from '../../store'

import { IKnowledgeType } from '../../../app/types/knowledge'

import { ApiKnowledge, ApiDocumentId } from '../../apis/index'

export default defineComponent({
  name: 'SideHeader',
  setup () {
    const store = useStore()
    const collections = computed(() => store.getters['knowledge/getList'])
    const collectionsFold = ref(false)
    const collectionsLoading = ref(false)
    const getList = () => {
      collectionsLoading.value = true
      store.dispatch('knowledge/getList').finally(() => {
        console.log(collections)
        collectionsLoading.value = false
      })
      // ApiKnowledge().then(res => {
      //   collections.value = res.data
      // }).finally(() => {
      //   collectionsLoading.value = false
      // })
    }
    getList()

    const recycles = ref<{

    }[]>([])
    const recyclesFold = ref(true)
    recycles.value = [{
      groupName: '2021-12-06',
      children: [{
        id: '1',
        title: '下拉菜单 Dropdown'
      }, {
        id: '2',
        title: '支持指定 6 种弹出方位'
      }, {
        id: '3',
        title: '可将备选命令收纳到向下展开的浮层容器中'
      }, {
        id: '4',
        title: '交互按钮类图标'
      }]
    }, {
      groupName: '2021-12-06',
      children: [{
        id: '1',
        title: '下拉菜单 Dropdown'
      }, {
        id: '2',
        title: '支持指定 6 种弹出方位'
      }, {
        id: '3',
        title: '可将备选命令收纳到向下展开的浮层容器中'
      }, {
        id: '4',
        title: '交互按钮类图标'
      }]
    }]
    const visible = ref(false)
    const form = reactive({
      name: ''
    })
    return {
      collectionsLoading,
      collections,
      collectionsFold,
      recycles,
      recyclesFold,
      visible,
      form,
      handleOk () {},
      handleCancel () {
        visible.value = false
      },
    }
  }
})
</script>
<style lang="scss">
.#{$--prefix}-side-content {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  .#{$--prefix}-collection-group {
    padding: 8px;
    > .title {
      display: flex;
      align-items: center;
      cursor: pointer;
      .fold {
        button {
          width: 20px;
          height: 20px;
          background-color: transparent;
          &:hover, &:focus {
            background-color: var(--color-secondary-hover);
          }
        }
        .fold-icon {
          transform: rotate(90deg);
        }
      }
      .name {
        flex: 1;
        color: var(--color-text-2);
        padding: 0 4px;
        transition: $--transition;
      }
      .action {
        button {
          background-color: transparent;
          &:hover, &:focus {
            background-color: var(--color-secondary-hover);
          }
        }
      }
      &:hover {
        .name {
          color: var(--color-text-1);
        }
      }
    }
    > .list {
      padding-top: 8px 0 4px;
      ul, li {
        @include reset();
      }
      .links {
        padding: 8px 0;
        li {
          display: flex;
          padding: 2px 0 2px 20px;
          .name {
            flex: 1;
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            a {
              display: block;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          &.current {
            background-color: var(--color-bg-2);
          }
        }
        .g-title {
          color: var(--color-text-4);
          font-size: 12px;
          padding-left: 28px;
          padding-bottom: 4px;
        }
        li + .g-title {
          margin-top: 16px;
        }
        a {
          color: var(--color-text-3);
           &:hover {
             color: var(--color-text-1);
           }
        }
        .more {
          background-color: transparent;
          color: var(--color-text-4);
          &:hover, &:focus {
            background-color: var(--color-secondary-hover);
          }
        }
      }
    }
  }
}
.#{$--prefix}-more-dropdown {
  .#{$--prefix}-more-doption {
    line-height: 28px;
    height: 28px;
  }
}
</style>
