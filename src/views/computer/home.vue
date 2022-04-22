<template>
  <div class="home">
    <pkm-typography-title :heading="1">{{ title }}</pkm-typography-title>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Home',
  setup () {
    const title: string = 'Personal Knowledge Management'
    return {
      title
    }
  }
})
</script>
<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  h1 {
    color: var(--color-bg-5);
    font-size: 50px;
  }
}
</style>
