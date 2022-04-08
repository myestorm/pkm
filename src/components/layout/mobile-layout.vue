<template>
  <div class="pkm-mobile-app">
    <header class="pkm-mobile-app-header fixed">
      <slot name="header">
        <pkm-page-header :title="title" :subtitle="subtitle" @back="backHandler"></pkm-page-header>
      </slot>
    </header>
    <main class="pkm-mobile-app-main" :style="mainStyle">
      <slot name="main"></slot>
    </main>
    <footer class="pkm-mobile-app-footer" v-if="footer">
      <slot name="footer">
        <pkm-row class="footer-nav" justify="space-around">
          <pkm-col :span="6" :gutter="0" v-for="(item, index) in navs" :key="index">
            <pkm-button type="text" :class="[current == index ? 'current' : '']" @click="toLink(item.url)">
              <component :size="24" :strokeWidth="3" :is="item.icon"></component>
              <strong>{{ item.title }}</strong>
            </pkm-button>
          </pkm-col>
        </pkm-row>
      </slot>
    </footer>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useRouter } from 'vue-router'
import useCommonStore from '../../store/index'

export default defineComponent({
  name: 'SideBar',
  components: {
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    headerHeight: {
      type: Number,
      default: 48
    },
    footer: {
      type: Boolean,
      default: true
    },
    back: {
      type: Function,
      default: () => {
        window.history.back()
      }
    },
    style: {
      type: Object,
      default: null
    }
  },
  setup (props) {
    const store = useCommonStore()
    const router = useRouter()
    const current = store.getMobileCurrent

    const _mainStyle = { paddingTop: `${props.headerHeight + 16}px`, paddingBottom: props.footer ? '' : '12px' }
    const mainStyle = Object.assign({}, _mainStyle, props.style)

    const navs = [{
      title: '首页',
      icon: 'icon-home',
      url: '/m/home'
    }, {
      title: '文档',
      icon: 'icon-file',
      url: '/m/file'
    }, {
      title: '书架',
      icon: 'icon-bookmark',
      url: '/m/book'
    }, {
      title: '系统',
      icon: 'icon-settings',
      url: '/m/setting'
    }]
    return {
      navs,
      current,
      mainStyle,
      toLink (url: string) {
        router.push(url)
      },
      backHandler () {
        if (typeof props.back === 'function') {
          props.back()
        }
      }
    }
  }
})
</script>
<style lang="scss" scoped>
$--header-height: 64px;
$--footer-height: 64px;
.#{$--prefix}-mobile-app {
  width: 100%;
  &-header {
    &.fixed {
      position: fixed;
      left: 0;
      top: 0;
      z-index: 10;
      width: 100%;
      background-color: var(--my-app-bg);
      // box-shadow: 0 0 8px rgba(0,0,0, 0.16);
    }
  }
  &-main {
    width: 100%;
    padding: $--header-height + 16px 16px $--footer-height + 16px;
    box-sizing: border-box;
  }
  &-footer {
    width: 100%;
    position: fixed;
    z-index: 10;
    left: 0;
    bottom: 0;
    background-color: var(--color-bg-4);
    box-shadow: 0 0 8px rgba(0,0,0, 0.16);
    .footer-nav {
      width: 100%;
      text-align: center;
      button {
        height: $--footer-height;
        color: var(--color-text-3);
        padding: 0 20px;
        line-height: 1.2;
        &.current {
          color: rgb(var(--primary-6));
        }
      }
      strong {
        width: 100%;
        text-align: center;
        display: block;
        font-weight: normal;
      }
    }
  }
}
</style>
