<template>
  <div class="pkm-totonoo-add-button">
    <pkm-dropdown popup-container=".pkm-totonoo-add-button" @select="selectHandler">
      <pkm-button type="primary" long>
        <template #icon>
          <icon-plus />
        </template>
        <template #default>
          新建
        </template>
      </pkm-button>
      <template #content>
        <slot></slot>
      </template>
    </pkm-dropdown>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  emits: ['change'],
  setup (props, ctx) {
    const selectHandler = (value: string | number | object) => {
      ctx.emit('change', value)
    }
    return {
      selectHandler
    }
  }
})
</script>
<style lang="scss">
.#{$--prefix}-add-button {
  .arco-trigger-popup {
    width: 264px;
    box-sizing: border-box;
    left: 8px !important;
    .arco-dropdown-option {
      justify-content: center;
    }
  }
}
</style>
