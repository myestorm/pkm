<template>
  <div>
    <button @click="insert">H2</button>
    <button @click="blod">加粗</button>
    <button @click="blockCode">代码块</button>
  </div>
  <div :id="id" :style="{
    height: height
  }"></div>
</template>

<script lang="ts">
import { onMounted, defineComponent } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import MarkdownEditor from './MarkdownEditor'


export default defineComponent({
  name: 'MarkdownEditor',
  props: {
    value: {
      type: String,
      defaut: ''
    },
    height: {
      type: String,
      default: '500px'
    }
  },
  setup (props, ctx) {
    const prefix = 'markdown-editor-'
    const id = uuidv4()

    const editor = new MarkdownEditor()
    const init = () => {
      const editorElement: Element | null = document.querySelector(`#${prefix}${id}`)
      if (editorElement) {
        editor.mounted(editorElement, {
          initValue: props.value || ''
        })
        ctx.emit('ready', editor)
      }
    }

    onMounted(() => {
      init()
    })

    return {
      id: prefix + id,
      insert () {
        editor.toggleInsertLineStart('## ')
      },
      blod () {
        editor.toggleAroundSelection('**', '**')
      },
      blockCode () {
        editor.insertAroundLine('```', '```')
      }
      // insert (text: string) {
      //   const anchor = editorView.state.selection.ranges[0].toJSON()
      //   const selectionText = editorView.state.sliceDoc(editorView.state.selection.ranges[0].from, editorView.state.selection.ranges[0].to)
      //   // console.log(editorView.state.sliceDoc(editorView.state.selection.ranges[0].from, editorView.state.selection.ranges[0].to))
      //   console.log(editorView.state.doc.lineAt(editorView.state.selection.ranges[0].from))
      //   const tr = editorView.state.update(
      //     editorView.state.changeByRange(range => {
      //       const line = editorView.state.doc.lineAt(range.from)
      //       return {
      //         changes: {
      //           from: range.from,
      //           to: range.to,
      //           insert: `${text} ${selectionText}`
      //         },
      //         range: EditorSelection.range(line.from, line.to + 3)
      //       }
      //     })
      //   )
      //   editorView.dispatch(tr)
      //   editorView.focus()
      //   // let tr = editorView.state.update(editorView.state.replaceSelection("!"))
      //   // console.log(editorView.state.selection)
      //   // console.log(tr.state.doc.toString()) // "!o!"
      //   // editorView.focus()
      //   // let transaction = editorView.state.update({changes: {from: 0, insert: text}})
      //   // console.log(transaction.state.doc.toString()) // "0123"
      //   // At this point the view still shows the old state.
      //   // const from = 2
      //   // const tr = editorView.state.update({
      //   //   changes: [
      //   //     { from, insert: ' ] ' }
      //   //   ],
      //   //   selection: { anchor: from + 41},
      //   //   scrollIntoView: true
      //   // })
      //   // editorView.dispatch(tr)
      // }
    }
  }
})
</script>
<style lang="scss">
.cm-editor {
  height: 100%;
  border: 1px #dddddd solid;
}
</style>
