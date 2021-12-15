<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script lang="ts">
import './assets/scss/app.scss'
import { defineComponent } from 'vue'

export default defineComponent({
  setup () {
    document.body.setAttribute('arco-theme', 'dark')
  }
})
</script>
