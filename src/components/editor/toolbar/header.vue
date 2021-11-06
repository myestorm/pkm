<template>
  <toolbar-list>
    <template #button>
      <button @click="insert" class="toolbar-btn"><i class="icon-header"></i></button>
    </template>
    <template #list>
      <div class="item" v-for="i in 6" @click="handler(i)">标题 {{ i }}</div>
    </template>
  </toolbar-list>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import toolbarList from './list.vue'
export default defineComponent({
  components: {
    toolbarList
  },
  props: {
    getEditor: {
      type: Function,
      default: () => null
    }
  },
  setup (props) {
    return {
      handler (heading) {
        const editor = props.getEditor()
        let text = ''
        for (let i = 0; i < heading; i++) {
          text += '#'
        }
        editor.toggleInsertLineStart(`${text} `)
      }
    }
  }
})
</script>