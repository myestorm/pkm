<template>
  <div id="app">
    <router-view :key="key"></router-view>
  </div>
</template>
<script lang="ts">
import './assets/scss/app.scss'
import { defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  setup () {
    const route = useRoute()
    const key = ref(route.fullPath)
    return {
      key
    }
  }
})
</script>
