<template>
  <div class="pkm-side-content">
    <pkm-collapse :default-active-key="['1']" :bordered="false">
      <pkm-collapse-item header="个人知识库" key="1" class="item-content">
        <ul class="links">
          <li><pkm-link href="#link">中国古代文学史</pkm-link></li>
          <li><pkm-link href="#link">前端学习笔记</pkm-link></li>
          <li><pkm-link href="#link">古代汉语</pkm-link></li>
          <li><pkm-link href="#link">未分类</pkm-link></li>
        </ul>
      </pkm-collapse-item>
      <pkm-collapse-item header="回收站" key="3">
        <div class="group">
          <div class="title">2012-07-08</div>
          <ul class="links">
            <li><pkm-link href="#link">中国古代文学史</pkm-link></li>
            <li><pkm-link href="#link">前端学习笔记</pkm-link></li>
            <li><pkm-link href="#link">古代汉语</pkm-link></li>
          </ul>
        </div>
      </pkm-collapse-item>
    </pkm-collapse>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'SideHeader',
  setup () {
    return {
      a () {
        alert(1)
      }
    }
  }
})
</script>
<style lang="scss">
.#{$--prefix}-side-content {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  .arco-collapse-item-header, .arco-collapse-item {
    border-width: 0;
    background-color: transparent;
    color: var(--color-text-2);
  }
  .arco-collapse-item-content {
    background-color: transparent;
  }
  .links {
    @include reset();
    li {
      @include reset();
      a {
        color: var(--color-text-3);
        display: block;
        width: 100%;
        &:hover {
          color: var(--color-text-1);
        }
      }
    }
  }
  .group {
    .title {
      border-bottom: 1px solid var(--color-neutral-3);
      color: var(--color-text-4);
      font-size: 12px;
      padding: 1px 4px;
      margin-bottom: 4px;
    }
  }
}
</style>
