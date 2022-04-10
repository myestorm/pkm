<template>
  <mobile-layout title="书架" subtitle="所有书籍的列表" :back="pageBack">
    <template #main>
      <div class="pkm-mobile-file-list">
        <search-list placeholder="搜索所有书籍" type="book" @itemClick="itemClickHandler"></search-list>
        <!-- <div class="filter">
          <pkm-space>
            <pkm-select :style="{width:'120px'}" placeholder="Select" class="filter-selector" size="small">
              <pkm-option>Beijing-Beijing-Beijing</pkm-option>
              <pkm-option>Shanghai</pkm-option>
              <pkm-option>Guangzhou</pkm-option>
              <pkm-option disabled>Disabled</pkm-option>
            </pkm-select>
            <pkm-select :style="{width:'120px'}" placeholder="Select" class="filter-selector" size="small">
              <pkm-option>Beijing-Beijing-Beijing</pkm-option>
              <pkm-option>Shanghai</pkm-option>
              <pkm-option>Guangzhou</pkm-option>
              <pkm-option disabled>Disabled</pkm-option>
            </pkm-select>
          </pkm-space>
        </div> -->
        <div class="content">
          <div class="book-list">
            <ul>
              <li class="item" v-for="item in list" :key="item._id">
                <div class="link" @click="info(item._id)">
                  <img :src="item.cover" style="width: 100%; height: 140px;" />
                  <div class="title">{{ item.title }}</div>
                </div>
                <div class="action">
                  <pkm-dropdown position="br">
                    <pkm-button-group>
                      <pkm-button type="text" class="btn-info">
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
              </li>
            </ul>
          </div>
        </div>
        <pkm-button type="primary" shape="circle" class="fix-btn" size="large" @click="add">
          <icon-plus />
        </pkm-button>
      </div>
    </template>
  </mobile-layout>
</template>
<script lang="ts">
import { defineComponent, ref, getCurrentInstance } from 'vue'
import MobileLayout from '../../components/layout/mobile-layout.vue'
import SearchList, { ListItemType } from '../../components/search-list/index.vue'
import useCommonStore from '../../store/index'
import { BookList, BookRemove } from '../../apis/book'
import { useRouter } from 'vue-router'
import { IBookDataApiType } from '../../../types/book'

export default defineComponent({
  components: {
    MobileLayout,
    SearchList
  },
  setup () {
    const app = getCurrentInstance()
    const msg = app?.appContext.config.globalProperties.$message
    const modal = app?.appContext.config.globalProperties.$modal

    const store = useCommonStore()
    const router = useRouter()

    const list = ref<IBookDataApiType[]>([])
    const getList = () => {
      BookList().then(res => {
        list.value = res.data || []
      }).catch(err => {
        msg.error(err.message)
      })
    }
    const add = () => {
      router.push('/m/book/editor/')
    }
    const edit = (id: string) => {
      router.push(`/m/book/editor/${id}`)
    }
    const info = (id: string) => {
      router.push(`/m/book/info/${id}`)
    }
    const remove = (id: string) => {
      modal.open({
        title: '系统提示',
        content: `该操作会删除内容，是否继续？`,
        hideCancel: false,
        simple: true,
        modalClass: ['pkm-modal-simple'],
        onOk () {
          BookRemove(id).then(_ => {
            getList()
          }).catch(err => {
            msg.error(err.message)
          })
        }
      })
    }
    const itemClickHandler = (item: ListItemType) => {
      info(item._id)
    }
    getList()

    const pageBack = () => {
      router.push('/m/home')
    }

    store.mobile.current = 2

    return {
      pageBack,
      list,
      add,
      edit,
      remove,
      info,
      itemClickHandler
    }
  }
})
</script>
