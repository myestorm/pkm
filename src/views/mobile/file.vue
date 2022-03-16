<template>
  <mobile-layout title="文档" subtitle="所有文档的列表">
    <template #main>
      <div class="pkm-mobile-file-list">
        <div class="search">
          <pkm-input-search placeholder="搜索所有文档" class="search-input" />
        </div>
        <!-- <div class="filter"></div> -->
        <div class="content">
          <div class="file-list">
            <ul>
              <li class="item" v-for="i in 10" :key="i">
                <div class="icon">
                  <!-- <icon-file :size="24" :strokeWidth="2" /> -->
                  <icon-folder :size="24" :strokeWidth="2" />
                </div>
                <div class="info">
                  <div class="title">这将为你提供一个参数数组这些也可以通过在右括号后添加它们与自定义正则结合使用</div>
                  <div class="day">2022-02-22 11:51</div>
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
        <pkm-button type="primary" shape="circle" class="fix-btn" size="large" @click="add()">
          <icon-plus />
        </pkm-button>
      </div>
    </template>
  </mobile-layout>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import MobileLayout from '../../components/layout/mobile-layout.vue'
import { useStore  } from '../../store'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  components: {
    MobileLayout
  },
  setup () {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()

    console.log(route.params.path)
    store.commit('setMobileCurrent', 1)

    return {
      add () {
        router.push('/m/markdown')
      }
    }
  }
})
</script>
