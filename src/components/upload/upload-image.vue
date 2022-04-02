<template>
  <div class="pkm-upload-image">
    <pkm-upload
      list-type="picture-card"
      :action="action"
      :headers="headers"
      :limit="limit"
      :file-list="fileList"
      :on-before-remove="remove"
      @preview="onPreview"
      @success="add"
    />
    <pkm-image-preview-group
      v-model:visible="visible"
      v-model:current="current"
      infinite
      :srcList="srcList"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

import type { FileItem } from '@arco-design/web-vue/es/upload/interfaces'
import config from './config'
type IFileListItemType = {
  uid: string,
  name: string,
  url: string
}
type IPreviewType = string[]

const UPDATEMODELVALUE = 'update:modelValue'

export default defineComponent({
  emits: [UPDATEMODELVALUE],
  props: {
    modelValue: {
      type: [String, Array],
      defaut: ''
    },
    limit: {
      type: Number,
      default: 1
    }
  },
  setup (props, ctx) {
    const { action, headers } = config
    const visible = ref(false)
    const fileList = ref<IFileListItemType[]>([]) // 文件列表
    const current = ref(0) // 预览
    const srcList = ref<string[]>([]) // 预览列表

    const setValue = (val: string | string[]) => {
      if (val) {
        const list: IFileListItemType[] = []
        const previews: IPreviewType = []
        if (Array.isArray(val)) {
          val.forEach((url, index) => {
            list.push({
              uid: index.toString(),
              name: '',
              url
            })
            previews.push(url)
          })
        } else {
          list.push({
            uid: '0',
            name: '',
            url: val
          })
          previews.push(val)
        }
        fileList.value = [...list]
        srcList.value = [...previews]
      } else {
        fileList.value = []
        srcList.value = []
      }
    }
    // 设置初始值
    setValue(<string | string[]>props.modelValue)

    // 预览
    const onPreview = (fileItem: FileItem) => {
      const index = srcList.value.findIndex(i => i === fileItem.url)
      current.value = index
      visible.value = true
    }

    const emitEvent = () => {
      if (Array.isArray(<string | string[]>props.modelValue)) {
        ctx.emit(UPDATEMODELVALUE, [...srcList.value])
      } else {
        ctx.emit(UPDATEMODELVALUE, srcList.value.join(''))
      }
    }

    const add = (response: any) => {
      const res = response.response
      if (Number(res.code) === 0) {
        const url = `${res.data.domain}${res.data.filepath}`
        fileList.value.push({
          uid: srcList.value.length.toString(),
          name: '',
          url
        })
        srcList.value.push(url)
        emitEvent()
      }
    }
    const remove = (fileItem: FileItem) => {
      const url = fileItem.url
      const indexSrc = srcList.value.findIndex(i => i === url)
      srcList.value.splice(indexSrc, 1)

      const indexFile = fileList.value.findIndex(i => i.url === url)
      fileList.value.splice(indexFile, 1)
      emitEvent()
    }
    watch(
      () => props.modelValue,
      (value) => {
        setValue(<string | string[]>value)
      }
    )
    return {
      action,
      headers,
      visible,
      current,
      fileList,
      srcList,
      onPreview,
      add,
      remove
    }
  }
})
</script>

