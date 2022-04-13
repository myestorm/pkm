<template>
  <pkm-layout class="pkm-side-bar">
    <pkm-layout-header class="header" @click="toLink('/p/home')">
      <totonoo-logo :style="logoStyle"></totonoo-logo>
    </pkm-layout-header>
    <pkm-layout-content class="content">
      <pkm-space direction="vertical" fill>
        <template v-for="(item, index) in pcNav" :key="index">
          <pkm-button type="text" :class="[pcCurrent == index ? 'current' : '']" @click="toLink(item.url, index)">
            <component :size="24" :strokeWidth="3" :is="item.icon"></component>
            <strong>{{ item.title }}</strong>
          </pkm-button>
        </template>
      </pkm-space>
    </pkm-layout-content>
    <pkm-layout-footer class="footer">
      <pkm-space direction="vertical" fill>
        <template v-for="(item, index) in footer" :key="index">
          <pkm-button type="text" @click="toLink(item.url)">
            <component :size="24" :strokeWidth="3" :is="item.icon"></component>
            <strong>{{ item.title }}</strong>
          </pkm-button>
        </template>
      </pkm-space>
    </pkm-layout-footer>
  </pkm-layout>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import TotonooLogo from '../../totonoo-logo/index.vue'
import useStore from '../../../store/modules/navigation/index'

export default defineComponent({
  name: 'PcSideBar',
  components: {
    TotonooLogo
  },
  setup () {
    const store = useStore()
    const router = useRouter()
    const { pcCurrent, pcNav } = storeToRefs(store)
    const logoStyle = {
      width: '40px',
      height: '40px',
      color: '#009844'
    }
    const footer = [{
      title: '系统',
      icon: 'icon-settings',
      url: '/m/setting'
    }]
    const toLink = (url: string, index?: number) => {
      router.push(url)
    }
    return {
      pcCurrent,
      logoStyle,
      pcNav,
      footer,
      toLink
    }
  }
})
</script>
<style lang="scss" scoped>
.#{$--prefix}-side-bar {
  width: 100%;
  height: 100%;
  .header {
    text-align: center;
    padding: 4px 0;
    margin: 0 0 4px 0;
    cursor: pointer;
  }
  .content, .footer {
    width: 100%;
    text-align: center;
    button {
      width: 100%;
      height: auto;
      color: var(--color-text-3);
      padding: 4px 0;
      line-height: 1.2;
      border-radius: 0;
      &.current {
        color: rgb(var(--primary-6));
        background-color: var(--color-fill-2);
      }
    }
    strong {
      width: 100%;
      text-align: center;
      display: block;
      font-weight: normal;
      margin-top: 4px;
    }
  }
  .footer {
    button {
      padding: 8px 0;
    }
    strong {
      display: none;
    }
  }
}
</style>