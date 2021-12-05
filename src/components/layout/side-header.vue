<template>
  <div class="pkm-side-header">
    <div class="logo">
      <a href="/">
        <img src="../../assets/logo/logo.svg">
      </a>
    </div>
    <h1 class="name">Totonoo</h1>
    <pkm-button>
      <template #icon>
        <icon-more-vertical />
      </template>
    </pkm-button>
  </div>
  <div class="pkm-side-header-action">
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
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'SideHeader',
  setup () {
    return {
    }
  }
})
</script>
<style lang="scss" scoped>
.#{$--prefix}-side-header {
  display: flex;
  align-items: center;
  padding: 8px;
  .logo {
    img {
      width: 36px;
    }
  }
  .name {
    @include reset();
    flex: 1;
    color: var(--color-text-1);
    font-size: 16px;
    text-align: center;
    text-transform: uppercase;
  }
}
.#{$--prefix}-side-header-action {
  padding: 8px;
}
</style>
