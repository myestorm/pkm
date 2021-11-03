<template>
  <pkm-layout class="app-side-bar">
    <pkm-layout-header style="color: #fff; padding: 16px 0; text-align: center">APP</pkm-layout-header>
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
  IconUser
} from '@arco-design/web-vue/es/icon'
export default {
  name: 'SideBar',
  components: {
    IconFolder,
    IconFile,
    IconSettings,
    IconUser
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
        border-radius: 4px 0 0 4px;
      }
    }
    .link {
      border-left: 3px solid transparent;
      border-right: 3px solid transparent;
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
