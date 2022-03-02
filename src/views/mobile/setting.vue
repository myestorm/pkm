<template>
  <mobile-layout title="系统设置" subtitle="基础数据配置">
    <template #main>
      <pkm-collapse :default-active-key="['1', 2]" expand-icon-position="right" class="setting">
        <pkm-collapse-item header="系统设置" key="1" disabled :show-expand-icon="false">
          <pkm-form-item label="黑暗模式">
            <pkm-switch @change="changeHandler" />
          </pkm-form-item>
        </pkm-collapse-item>
      </pkm-collapse>
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

    store.commit('setMobileCurrent', 3)
    return {
      changeHandler (val: boolean) {
        if (val) {
          document.body.setAttribute('arco-theme', 'dark')
        } else {
          document.body.removeAttribute('arco-theme')
        }
      }
    }
  }
})
</script>
<style lang="scss">
.setting {
  .arco-collapse-item-content {
    background-color: var(--color-bg-2) !important;
  }
}
</style>
