<template>
  <div class="pkm-side-footer">
    <router-link to="/" class="link"><icon-user :strokeWidth="strokeWidth" /></router-link>
    <router-link to="/" class="link"><icon-question-circle :strokeWidth="strokeWidth" /></router-link>
    <router-link to="/" class="link"><icon-settings :strokeWidth="strokeWidth" /></router-link>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'SideFooter',
  setup () {
    return {
      strokeWidth: 3
    }
  }
})
</script>
<style lang="scss" scoped>
.#{$--prefix}-side-footer {
  display: flex;
  padding: 16px;
  a {
    color: var(--color-text-1);
    margin: 4px;
    font-size: 20px;
  }
}
</style>