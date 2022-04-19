<template>
  <div class="home">
    <drag-sort style="width: 300px" />
    <pkm-typography-title :heading="1">{{ title }}</pkm-typography-title>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import DragSort from '../../components/drag-sort/index.vue'
export default defineComponent({
  name: 'Home',
  components: {
    DragSort
  },
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
