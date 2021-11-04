<template>
  <pkm-layout class="app-side-bar">
    <pkm-layout-header>
      <img src="../../assets/logo/logo.svg" class="logo">
    </pkm-layout-header>
    <pkm-layout-content>
      <div class="menu">
        <ul>
          <li class="current">
            <router-link to="/" class="link"><icon-file :strokeWidth="strokeWidth" /></router-link>
          </li>
          <li>
            <router-link to="/" class="link"><icon-folder :strokeWidth="strokeWidth" /></router-link>
          </li>
        </ul>
      </div>
    </pkm-layout-content>
    <pkm-layout-footer>
      <div class="menu">
        <ul>
          <li>
            <router-link to="/" class="link"><icon-user :strokeWidth="strokeWidth" /></router-link>
          </li>
          <li>
            <router-link to="/" class="link"><icon-question-circle :strokeWidth="strokeWidth" /></router-link>
          </li>
          <li>
            <router-link to="/" class="link"><icon-settings :strokeWidth="strokeWidth" /></router-link>
          </li>
        </ul>
      </div>
    </pkm-layout-footer>
  </pkm-layout>
</template>
<script lang="ts">
import {
  IconFolder,
  IconFile,
  IconSettings,
  IconUser,
  IconQuestionCircle
} from '@arco-design/web-vue/es/icon'
export default {
  name: 'SideBar',
  components: {
    IconFolder,
    IconFile,
    IconSettings,
    IconUser,
    IconQuestionCircle
  },
  setup () {
    return {
      strokeWidth: 3
    }
  }
}
</script>
<style lang="scss" scoped>
.app-side-bar {
  height: calc(100vh - 0px);
  background-color: #424242;
  .logo {
    width: auto;
    height: 40px;
    display: block;
    margin: 8px auto;
  }
  .menu {
    ul, li {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .current {
      .link {
        border-left-color: #ffffff;
        color: #ffffff;
      }
    }
    .link {
      border-left: 2px solid transparent;
      border-right: 2px solid transparent;
      color: #999999;
      transition: all 260ms ease-in;
      display: block;
      text-align: center;
      font-size: 1.6rem;
      line-height: 2;
      &:hover {
        color: #ffffff;
        background: rgba(255, 255, 255, 0.1);
      }
    }
  }
}
</style>
