<template>
  <pkm-layout class="layout-app">
    <pkm-layout-sider class="side-bar app-side-bar">
      <pkm-layout class="vh-100">
        <pkm-layout-header>
          <pkm-row justify="space-between">
            <pkm-col :span="8">
              <img src="./assets/logo/logo.svg" class="logo">
            </pkm-col>
            <pkm-col :span="8">
              <div>Totonoo</div>
            </pkm-col>
            <pkm-col :span="8">
              <pkm-button>
                <template #icon>
                  <icon-more-vertical />
                </template>
              </pkm-button>
            </pkm-col>
          </pkm-row>
          <pkm-dropdown>
            <pkm-button type="primary" long>
              <template #icon>
                <icon-plus />
              </template>
              <template #default>
                新建
              </template>
            </pkm-button>
            <template #content>
              <pkm-doption style="width: 100%">文档</pkm-doption>
              <pkm-doption style="width: 100%">知识库</pkm-doption>
            </template>
          </pkm-dropdown>
        </pkm-layout-header>
        <pkm-layout-content>
          <pkm-collapse :default-active-key="['1']" :bordered="false">
            <pkm-collapse-item header="个人知识库" key="1">
              <div>中国古代文学史</div>
              <div>前端学习笔记</div>
              <div>古代汉语</div>
            </pkm-collapse-item>
            <pkm-collapse-item header="回收站" key="3">
              <div>Beijing Toutiao Technology Co., Ltd.</div>
              <div>Beijing Toutiao Technology Co., Ltd.</div>
              <div>Beijing Toutiao Technology Co., Ltd.</div>
            </pkm-collapse-item>
          </pkm-collapse>
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
    </pkm-layout-sider>
    <pkm-layout-content>
      <router-view></router-view>
    </pkm-layout-content>
  </pkm-layout>
</template>
<script lang="ts">
import './assets/scss/app.scss'
import { defineComponent } from 'vue'

export default defineComponent({
  setup () {
    document.body.setAttribute('arco-theme', 'dark')
    return {
      a: document.querySelector('.vh-100') 
    }
  }
})
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
    ul {
      display: flex;
      align-items: center;
      justify-content: center;
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

