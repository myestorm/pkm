<template>
  <pkm-upload
    list-type="picture-card"
    action="/file/upload"
    :limit="1"
    :default-file-list="fileList"
    @preview="onPreview"
    @success="success"
  />
  <pkm-image-preview-group
    v-model:visible="visible"
    v-model:current="current"
    infinite
    :srcList="srcList"
  />
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  emits: ['update:value'],
  props: {
    value: {
      type: String,
      defaut: ''
    }
  },
  setup (props, ctx) {
    const visible = ref(false)
    const current = ref(3)
    const fileList = ref<{
      url: string
    }[]>([])
    const srcList = ref<string[]>([])
    const onPreview = (index: number) => {
      current.value = index
      visible.value = true
    }
    const success = (fileItem: any) => {
      const url = `${fileItem.domain}${fileItem.filepath}`
      fileList.value.push({
        url
      })
      srcList.value.push(url)
      ctx.emit('update:value', url)
    }
    return {
      visible,
      current,
      fileList,
      srcList,
      onPreview,
      success
    }
  }
})
</script>

