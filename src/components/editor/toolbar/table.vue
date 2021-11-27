<template>
  <toolbar-list>
    <template #button>
      <button class="toolbar-btn"><i class="icon-table"></i></button>
    </template>
    <template #list>
      <table class="table-gird" :style="{
        width: `${size * rows}px`,
        height: `${size * cols}px`
      }">
        <thead>
          <tr>
            <th v-for="col in cols" :style="{
              width: `${size}px`,
              height: `${size}px`
            }"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows">
            <td v-for="col in cols" @mouseover="mouseoverEvent(row, col)"></td>
          </tr>
        </tbody>
      </table>
    </template>
  </toolbar-list>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
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
    const size = 16
    const rows = ref(3)
    const cols = ref(3)
    return {
      rows,
      cols,
      size,
      handler () {
        const editor = props.getEditor()
        editor.insertLineAfterCursor('* * *')
      },
      mouseoverEvent (row: number, col: number) {
        console.log(111)
      }
    }
  }
})
</script>
<style lang="scss" scope>
.table-gird {
  th, td {
    border: 1px #ffffff solid;
  }
}
</style>
