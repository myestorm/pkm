<template>
  <mobile-layout title="当页面滚动" subtitle="窗口改变">
    <template #header>
      <div class="header">
        <pkm-input-search placeholder="" class="search-input" />
        <pkm-button>
          <template #icon>
            <icon-scan />
          </template>
        </pkm-button>
      </div>
    </template>
    <template #main>
      <pkm-space direction="vertical" size="medium" fill>
        <pkm-card title="最近文档" class="pkm-card">
          <div class="item" v-for="i in ['bsp hal开发文档', 'AliOS系统安全性', 'PageLink与广播', 'Manifest配置']" :key="i">
            <div class="day">2022-02-22 17:44</div>
            <div class="name"><icon-file />{{ i }}</div>
          </div>
        </pkm-card>
        <pkm-card title="书架更新" class="pkm-card">
          <pkm-row :gutter="[8, 8]">
            <pkm-col :span="12">
              <pkm-image src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/cd7a1aaea8e1c5e3d26fe2591e561798.png~tplv-uwbnlip3yd-webp.webp" width="100%" />
            </pkm-col>
            <pkm-col :span="12">
              <pkm-image src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/6480dbc69be1b5de95010289787d64f1.png~tplv-uwbnlip3yd-webp.webp" width="100%" />
            </pkm-col>
            <pkm-col :span="12">
              <pkm-image src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/0265a04fddbd77a19602a15d9d55d797.png~tplv-uwbnlip3yd-webp.webp" width="100%" />
            </pkm-col>
            <pkm-col :span="12">
              <pkm-image src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/24e0dd27418d2291b65db1b21aa62254.png~tplv-uwbnlip3yd-webp.webp" width="100%" />
            </pkm-col>
            <pkm-col :span="12">
              <pkm-image src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/cd7a1aaea8e1c5e3d26fe2591e561798.png~tplv-uwbnlip3yd-webp.webp" width="100%" />
            </pkm-col>
            <pkm-col :span="12">
              <pkm-image src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/6480dbc69be1b5de95010289787d64f1.png~tplv-uwbnlip3yd-webp.webp" width="100%" />
            </pkm-col>
            <pkm-col :span="12">
              <pkm-image src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/0265a04fddbd77a19602a15d9d55d797.png~tplv-uwbnlip3yd-webp.webp" width="100%" />
            </pkm-col>
            <pkm-col :span="12">
              <pkm-image src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/24e0dd27418d2291b65db1b21aa62254.png~tplv-uwbnlip3yd-webp.webp" width="100%" />
            </pkm-col>
          </pkm-row>
        </pkm-card>
      </pkm-space>
    </template>
  </mobile-layout>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import MobileLayout from '../../components/layout/mobile-layout.vue'
import { useStore  } from '../../store'

export default defineComponent({
  components: {
    MobileLayout
  },
  setup () {
    const store = useStore()

    store.commit('setMobileCurrent', 0)
    return {
    }
  }
})
</script>
<style lang="scss" scoped>
.header {
  padding: 12px 12px 6px;
  display: flex;
  align-items: center;
  .search-input {
    border-radius: 16px;
    flex: 1;
    margin-right: 16px;
    background-color: var(--color-bg-1);
  }
}
</style>
