<template>
  <div class="pkm-md-editor-dialog">
    <button @click="isShow = !isShow" class="toolbar-btn"><i class="icon-media"></i></button>
    <div class="dialog" v-show="isShow">
      <div class="form">
        <div class="form-item">
          <label for="toolbar-media-url">地址</label>
          <input type="text" v-model="url" id="toolbar-media-url">
          <div class="upload-btn">
            <input type="file" name="file" ref="fileField" id="toolbar-media-file" @change="upload">
            <button type="button" @click="triggerClick">本地上传</button>
          </div>
        </div>
        <div class="form-item">
          <label for="toolbar-media-desc">描述</label>
          <input type="text" v-model="desc" id="toolbar-media-desc">
        </div>
        <div class="form-item pl">
          <button type="button" @click="isShow = false" style="margin-right: 16px;">关闭</button>
          <button type="button" @click="handler">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { EditorSelection, Transaction, SelectionRange } from '@codemirror/state'
import { defineComponent, ref } from 'vue'
export default defineComponent({
  props: {
    getEditor: {
      type: Function,
      default: () => null
    }
  },
  setup (props) {
    const url = ref('')
    const desc = ref('')
    const isShow = ref(false)
    const fileId = 'toolbar-media-file'
    return {
      url,
      desc,
      isShow,
      triggerClick () {
        const fileField: HTMLInputElement | null = document.querySelector('input#'+ fileId)
        if (fileField){
          fileField.click()
        }
      },
      upload () {
        const formData = new FormData()
        const fileField: HTMLInputElement | null = document.querySelector('input#'+ fileId)
        if (fileField && fileField.files && fileField.files[0]) {
          formData.append('file', fileField.files[0])
          fetch('/file/upload', {
            method: 'post',
            body: formData
          })
          .then(response => response.json())
          .then(result => {
            url.value = result.data.domain + result.data.filepath
          })
          .catch(error => {
            console.error('Error:', error)
          })
          .then(() => {
            fileField.value = ''
          })
        }
      },
      handler () {
        const editor = props.getEditor()
        const { view } = editor
        if (view) {
          const state = view.state
          const tr: Transaction = state.update(
            state.changeByRange((range: SelectionRange) => {
              const insertion = `![${desc.value}](${url.value})`
              return {changes: {
                  from: range.from,
                  to: range.to,
                  insert: insertion
                },
                range: EditorSelection.range(range.to + insertion.length, range.to + insertion.length)
              }
            })
          )
          view.dispatch(tr)
          view.focus()
          isShow.value = false
          url.value = ''
          desc.value = ''
        }
      }
    }
  }
})
</script>
