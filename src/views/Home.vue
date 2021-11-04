<template>
  <pkm-layout class="layout-app">
    <pkm-layout-sider class="aside">
      <pkm-layout class="home-side-bar">
        <pkm-layout-header>
          <pkm-input-search :style="{width:'100%', height: `${hh}px`}" placeholder="输入关键字搜索" loading />
        </pkm-layout-header>
        <pkm-layout-content>
          <pkm-list :max-height="vh - hh" :bordered="false" @reach-bottom="reachBottom" class="pkm-list">
            <pkm-list-item-meta
              v-for="i in 30"
              class="pkm-list-item"
              :class="[i === 2 ? 'current' : '']"
              title="智能设计体系连接轻盈体验"
              description="通过arco风格配置平台和IconBox图标平台，智能生成适合多种业务需求的个性化主题..."></pkm-list-item-meta>
          </pkm-list>
        </pkm-layout-content>
      </pkm-layout>
    </pkm-layout-sider>
    <pkm-layout-content>
      <markdown-editor :value="value" />
    </pkm-layout-content>
  </pkm-layout>
</template>
<script lang="ts">
import { ref } from 'vue'
import '../assets/scss/app.scss'
import MarkdownEditor from '../components/editor/MarkdownEditor.vue'
const value = `## title1

~~sdadas~~

**sadsad**

\`test\`

\`\`\`javascript
import { onMounted } from 'vue'
import { EditorState, EditorView, basicSetup } from "@codemirror/basic-setup"
import { markdown, markdownLanguage } from "@codemirror/lang-markdown"
\`\`\`

中文`
export default {
  name: 'Home',
  components: {
    MarkdownEditor
  },
  setup () {
    const hh = 46
    const vh = document.body.clientHeight
    const loading = ref(true)
    let data = ref([])
    return {
      hh,
      vh,
      loading,
      value,
      data,
      reachBottom () {
        console.log(1)
      },
      handleSearch (value: string) {
        // if (value) {
        //   data = [...Array(5)].map((_, index) => `${value}-${index}`)
        // } else {
        //   data = []
        // }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.home-side-bar {
  height: calc(100vh - 2px);
}
.aside {
  width: 280px !important;
}
.pkm-list {
  .pkm-list-item {
    padding: 8px 12px;
    cursor: pointer;
    transition: all 260ms ease;
    border-left: 3px solid transparent;
    border-right: 3px solid transparent;
    &.current {
      border-left-color: $--primary-color;
      background-color: #17171a;
    }
    &:hover {
      background-color: #17171a;
    }
    &:first-child {
      padding-top: 16px;
    }
    &:last-child {
      padding-bottom: 16px;
    }
    .arco-list-item-meta-title {
      font-size: 16px !important;
    }
  }
}
</style>
