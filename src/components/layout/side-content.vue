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
          <pkm-button size="mini" @click="add">
            <template #icon>
              <icon-plus />
            </template>
          </pkm-button>
        </div>
      </div>
      <div class="list" v-show="!collectionsFold">
        <pkm-skeleton :animation="true" v-if="collectionsLoading">
          <pkm-space direction="vertical" :style="{ width:'100%' }">
            <pkm-skeleton-line :line-height="12" :line-spacing="8" :rows="3" />
          </pkm-space>
        </pkm-skeleton>
        <ul class="links" v-else>
          <li v-for="item in collections" :key="item._id" :class="[(selected?._id && item._id == selected._id) ? 'current' : '' ]">
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
                <pkm-doption class="pkm-more-doption" @click.stop="edit(item)">
                  <template #icon>
                    <icon-edit />
                  </template>
                  编辑
                </pkm-doption>
                <pkm-doption class="pkm-more-doption" @click.stop="del(item)" v-if="!item.isDefault">
                  <template #icon>
                    <icon-delete />
                  </template>
                  删除
                </pkm-doption>
                <pkm-doption class="pkm-more-doption" @click.stop="setDefault(item._id)" v-if="!item.isDefault">
                  <template #icon>
                    <icon-lock />
                  </template>
                  默认
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
          <pkm-space>
            <pkm-tooltip content="刷新数据">
              <pkm-button size="mini" @click="recycleReload">
                <template #icon>
                  <icon-loop />
                </template>
              </pkm-button>
            </pkm-tooltip>
            <pkm-tooltip content="清空回收站">
              <pkm-button size="mini" @click="recycleRemoveAll">
                <template #icon>
                  <icon-delete />
                </template>
              </pkm-button>
            </pkm-tooltip>
          </pkm-space>
        </div>
      </div>
      <div class="list" v-show="!recyclesFold">
        <ul class="links">
          <template v-for="item in recycles" :key="item._id">
            <li class="g-title">{{ item.title }}</li>
            <li v-for="sub in item.children" :key="sub._id"><pkm-link href="#link" class="name">{{ sub.title }}</pkm-link></li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, computed, getCurrentInstance } from 'vue'
import { useStore  } from '../../store'
import { IKnowledgeType } from '../../../app/types/knowledge'

export default defineComponent({
  name: 'SideHeader',
  setup () {
    const app = getCurrentInstance()
    const modal = app?.appContext.config.globalProperties.$modal
    const msg = app?.appContext.config.globalProperties.$message
    const store = useStore()

    const collections = computed(() => store.getters['knowledge/getList'])
    const selected = computed(() => store.getters['knowledge/getSelected'])
    const collectionsFold = ref(false)
    const collectionsLoading = ref(false)
    const getList = () => {
      collectionsLoading.value = true
      store.dispatch('knowledge/getList').finally(() => {
        collectionsLoading.value = false
      })
    }
    getList()

    const setDefault = (id: string) => {
      if (id) {
        store.dispatch('knowledge/setDefault', id).then(() => {
          getList()
        }).catch(err => {
          msg.error(err.message)
        })
      }
    }

    const recycles = computed(() => store.getters['recycle/getList'])
    const recyclesFold = ref(true)
    const recycleRemoveAll = () => {
      modal.warning({
        title: '系统提示',
        content: `该操作会清空回收站内所有内容，请确认是否执行此操作？`,
        hideCancel: false,
        onOk () {
          store.dispatch('recycle/removeAll')
        }
      })
    }
    store.dispatch('recycle/getList')

    const recycleReload = () => {
      store.dispatch('recycle/getList')
    }

    return {
      collectionsLoading,
      collections,
      selected,
      collectionsFold,
      setDefault,
      recycles,
      recyclesFold,
      add () {
        store.commit('setVisibleKnowledge', true)
      },
      edit (data: IKnowledgeType) {
        store.commit('setKnowledgeForm', { ...data })
        store.commit('setVisibleKnowledge', true)
      },
      del (data: IKnowledgeType) {
        modal.warning({
          title: '系统提示',
          content: `是否确定删除“${data.title}”？该知识库下的文档自动转移到“默认分类”目录下。`,
          hideCancel: false,
          onOk () {
            store.dispatch('knowledge/remove', data._id)
          }
        })
      },
      recycleRemoveAll,
      recycleReload
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
