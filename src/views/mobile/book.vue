<template>
  <mobile-layout title="书架" subtitle="所有书籍的列表">
    <template #main>
      <div class="pkm-mobile-file-list">
        <div class="search">
          <pkm-input-search placeholder="搜索所有书籍" class="search-input" />
        </div>
        <div class="filter">
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
        </div>
        <div class="content">
          <div class="book-list">
            <ul>
              <li class="item" v-for="i in 10" :key="i">
                <div class="link" @click="info()">
                  <img src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/cd7a1aaea8e1c5e3d26fe2591e561798.png~tplv-uwbnlip3yd-webp.webp" style="width: 100%; height: 140px;" />
                  <div class="title">这将为你提供一个</div>
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
                      <pkm-doption>
                        <template #icon>
                          <icon-edit />
                        </template>
                        编辑
                      </pkm-doption>
                      <pkm-doption>
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
import { defineComponent } from 'vue'
import MobileLayout from '../../components/layout/mobile-layout.vue'
import useCommonStore from '../../store/index'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  components: {
    MobileLayout
  },
  setup () {
    const store = useCommonStore()
    const router = useRouter()
    const route = useRoute()

    console.log(route.params.path)
    store.mobile.current = 2

    return {
      add () {
        router.push('/m/book/editor/')
      },
      info () {
        router.push('/m/book/info/')
      }
    }
  }
})
</script>
