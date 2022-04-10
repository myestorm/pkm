<template>
  <mobile-layout title="用户管理" subtitle="系统用户管理" :footer="false" :back="pageBack" class="editor-page">
      <template #main>
        <pkm-table :data="data" :pagination="false">
          <template #columns>
            <pkm-table-column title="用户名" datpkm-index="name"></pkm-table-column>
            <pkm-table-column title="手机" datpkm-index="salary"></pkm-table-column>
            <pkm-table-column title="邮箱" datpkm-index="address"></pkm-table-column>
            <pkm-table-column title="">
              <template #cell="{ record }">
                <pkm-button>{{record.title}}</pkm-button>
              </template>
            </pkm-table-column>
          </template>
        </pkm-table>
      </template>
  </mobile-layout>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import MobileLayout from '../../components/layout/mobile-layout.vue'

export default defineComponent({
  components: {
    MobileLayout
  },
  setup () {
    const router = useRouter()
    const data = ref([])
    const pageBack = () => {
      router.push('/m/setting')
    }
    return {
      pageBack,
      data
    }
  },
})
</script>
