<template>
  <div class="pkm-side-header">
    <div class="logo">
      <a href="/">
        <img src="../../assets/logo/logo.svg">
      </a>
    </div>
    <h1 class="name">Totonoo</h1>
    <pkm-dropdown position="br" class="pkm-more-dropdown">
      <pkm-button size="mini">
        <template #icon>
          <icon-more-vertical />
        </template>
      </pkm-button>
      <template #content>
        <pkm-doption class="pkm-more-doption">偏好设置</pkm-doption>
        <pkm-doption class="pkm-more-doption">关于系统</pkm-doption>
      </template>
    </pkm-dropdown>
  </div>
  <div class="pkm-side-header-action">
    <pkm-button type="primary" long @click.stop="toggleAction">
      <template #icon>
        <icon-plus />
      </template>
      <template #default>
        新建
      </template>
    </pkm-button>
    <div class="add-button-options" v-show="isDisplay">
      <pkm-button long @click="a">
        <template #icon>
          <icon-file />
        </template>
        <template #default>
          <span class="w">文档</span>
        </template>
      </pkm-button>
      <pkm-button long>
        <template #icon>
          <icon-folder />
        </template>
        <template #default>
          <span class="w">知识库</span>
        </template>
      </pkm-button>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'SideHeader',
  setup () {
    const isDisplay = ref(false)
    const hideAction = () => {
      isDisplay.value = false
      document.removeEventListener('click', hideAction)
    }
    const showAction = () => {
      isDisplay.value = true
      document.addEventListener('click', hideAction)
    }
    const toggleAction = () => {
      if (isDisplay.value) {
        hideAction()
      } else {
        showAction()
      }
    }
    return {
      isDisplay,
      hideAction,
      showAction,
      toggleAction,
      a () {
        console.log(1111)
      }
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
  button {
    background-color: transparent;
    &:hover, &:focus {
      background-color: var(--color-secondary-hover);
    }
  }
}
.#{$--prefix}-side-header-action {
  margin: 0 8px 8px;
  position: relative;
  .add-button-options {
    width: 100%;
    position: absolute;
    left: 0;
    top: calc(100% + 4px);
    z-index: 9;
    box-sizing: border-box;
    padding: 4px 0;
    background-color: var(--color-bg-popup);
    border: 1px solid var(--color-fill-3);
    border-radius: var(--border-radius-medium);
    box-shadow: 0 4px 10px #0000001a;
    button {
      background-color: transparent;
      &:hover {
        color: var(--color-text-2);
        background-color: var(--color-secondary-hover);
      }
      .w {
        display: inline-block;
        text-align: left;
        width: 60px;
      }
    }
  }
}
</style>
