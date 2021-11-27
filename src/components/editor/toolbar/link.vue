<template>
  <button @click="handler" class="toolbar-btn"><i class="icon-link"></i></button>
</template>
<script lang="ts">
import { EditorSelection, Transaction, SelectionRange } from '@codemirror/state'
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    getEditor: {
      type: Function,
      default: () => null
    }
  },
  setup (props) {
    return {
      handler () {
        const editor = props.getEditor()
        const { view } = editor
        if (view) {
          const state = view.state
          const tr: Transaction = state.update(
            state.changeByRange((range: SelectionRange) => {
              const text = state.sliceDoc(range.from, range.to)
              const insertion = `[${text}](https:// "${text}")`
              const offset = range.from + text.length + 11
              return {changes: {
                  from: range.from,
                  to: range.to,
                  insert: insertion
                },
                range: EditorSelection.range(offset, offset)
              }
            })
          )
          view.dispatch(tr)
          view.focus()
        }
      }
    }
  }
})
</script>
