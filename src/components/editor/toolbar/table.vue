<template>
  <toolbar-list>
    <template #button>
      <button class="toolbar-btn"><i class="icon-table"></i></button>
    </template>
    <template #list>
      <table class="table-gird" :style="{
        width: `${size * cols}px`,
        height: `${size * rows}px`
      }" @click="handler" @mouseleave="mouseleaveEvent">
        <tbody>
          <tr v-for="row in rows" :key="`tr-${row}`">
            <td v-for="col in cols" @mouseover="mouseoverEvent(row, col)" :key="`td-${row}-${col}`" :style="{
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: (row <= r && col <= c) ? '#000000' : '#424242'
            }"></td>
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
    const rows = ref(4)
    const cols = ref(4)
    const r = ref(0)
    const c = ref(0)
    let timer: number | null | undefined = null
    return {
      rows,
      cols,
      size,
      r,
      c,
      handler () {
        const editor = props.getEditor()
        let text = ''
        for (let row = 0; row < r.value; row++) {
          let cText = '|'
          let dText = row === 0 ? '|' : ''
          for (let col = 0; col < c.value; col++) {
            cText += '     |'
            if (row === 0) {
              dText += ' --- |'
            }
          }
          text += (cText + '\n')
          if (row === 0) {
            text += (dText + '\n')
          }
        }
        editor.insertLineAfterCursor(text)
      },
      mouseoverEvent (row: number, col: number) {
        r.value = row
        c.value = col
        if (timer) {
          window.clearTimeout(timer)
        }
        timer = window.setTimeout(() => {
          if (rows.value - row <= 1 ) {
            rows.value = rows.value + 1
          } else if (rows.value - row >= 4) {
            rows.value = row + 2
          }
          if (cols.value - col <= 1 ) {
            cols.value = cols.value + 1
          } else if (cols.value - col >= 4) {
            cols.value = col + 2
          }
        }, 0)
        
      },
      mouseleaveEvent () {
        r.value = 0
        c.value = 0
        cols.value = 4
        rows.value = 4
      }
    }
  }
})
</script>
<style lang="scss" scope>
.table-gird {
  border-collapse: collapse;
  margin: 0 4px;
  td {
    border: 1px #565656 solid;
    box-sizing: border-box;
    color: #ffffff;
    cursor: pointer;
  }
}
</style>
