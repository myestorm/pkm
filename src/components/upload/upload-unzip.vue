<template>
  <pkm-space>
    <pkm-input v-model="data.directory" placeholder="解压目录名" />
    <pkm-upload
      ref="uploadRef"
      :action="action"
      :headers="headers"
      :data="data"
      :show-file-list="false"
      :auto-upload="false"
      @success="successHandler"
    >
      <template #upload-button>
        <pkm-space>
          <pkm-button>选择文件</pkm-button>
          <pkm-button type="primary" @click="submit">上传并解压文件</pkm-button>
        </pkm-space>
      </template>
    </pkm-upload>
  </pkm-space>
</template>
<script lang="ts">
import { defineComponent, getCurrentInstance, reactive, ref } from 'vue'
import config from './config'
export default defineComponent({
  emits: ['success'],
  setup (props, ctx) {
    const app = getCurrentInstance()
    const msg = app?.appContext.config.globalProperties.$message
    const uploadRef = ref()
    const action = '/api/file/unzip'
    const data = reactive({
      directory: ''
    })
    const { headers } = config
    const successHandler = (response: any) => {
      const res = response.response
      data.directory = ''
      ctx.emit('success', res)
    }
    const submit = (e: Event) => {
      e.stopPropagation()
      if (data.directory && !/^[A-Za-z0-_]+$/.test(data.directory)) {
        msg.error('解压目录只能由英文字母、数字和_组成')
      } else {
        uploadRef.value.submit()
      }
    }
    return {
      uploadRef,
      data,
      action,
      headers,
      successHandler,
      submit
    }
  }
})
</script>
