<template>
  <div class="home">
    <pkm-typography-title :heading="1">{{ title }}</pkm-typography-title>
  </div>
</template>
<script lang="ts">

export default {
  name: 'Home',
  setup () {
    return {
      title: 'Personal Knowledge Management'
    }
  }
}
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
