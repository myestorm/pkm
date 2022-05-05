<template>
  <pkm-page-header title="系统" subtitle="文件管理" :show-back="false">
    <template #extra>
      <upload-unzip @success="successHandler" />
    </template>
    <pkm-table :data="list" :pagination="{
        total,
        current: page,
        'page-size': pagesize
      }"
      @page-change="pageChangeHandler"
    >
      <template #columns>
        <pkm-table-column title="类型" data-index="type"></pkm-table-column>
        <pkm-table-column title="路径" data-index="filepath"></pkm-table-column>
        <pkm-table-column title="操作" :width="160">
          <template #cell="{ record }">
            <pkm-button-group>
              <pkm-button type="outline" size="mini" @click="openHandler(record.filepath)">访问</pkm-button>
              <pkm-button type="outline" size="mini" @click="copyHandler(record.filepath)">复制</pkm-button>
              <pkm-button type="outline" size="mini" @click="removeHandler(record.id)">删除</pkm-button>
            </pkm-button-group>
          </template>
        </pkm-table-column>
      </template>
    </pkm-table>
  </pkm-page-header>
</template>
<script lang="ts">
import { defineComponent, getCurrentInstance, ref } from 'vue'
import UploadUnzip from '@/components/upload/upload-unzip.vue'

import * as TypesFile from '@/types/file'
import useStore from '@/store/index'
export default defineComponent({
  components: {
    UploadUnzip
  },
  setup () {
    const app = getCurrentInstance()
    const msg = app?.appContext.config.globalProperties.$message
    const modal = app?.appContext.config.globalProperties.$modal
    const dayjs = app?.appContext.config.globalProperties.$dayjs
    const copy = app?.appContext.config.globalProperties.$copy
    const store = useStore()

    const list = ref<TypesFile.IFileType[]>([])
    const total = ref(0)
    const page = ref(1)
    const pagesize = ref(20)
    const visible = ref(false)

    const getList = (_page: number, _pagesize: number) => {
      store.fileList({ page: _page, pagesize: _pagesize }).then(res => {
        list.value = res.data.list || []
        page.value = res.data.page
        total.value = res.data.total
      }).catch(err => {
        msg.error(err.message)
      })
    }
    const pageChangeHandler = (curr: number) => {
      getList(curr, pagesize.value)
    }
    const copyHandler = (text: string) => {
      copy(text).then(() => {
        msg.success('复制成功')
      }).catch(() => {
        msg.error('复制失败，请手动复制')
      })
    }
    const openHandler = (url: string) => {
      window.open(`/${url}`)
    }
    const removeHandler = (id: string) => {
      modal.open({
        title: '系统提示',
        content: `确定要删除文件或文件夹，该操作不可逆，请谨慎操作？`,
        hideCancel: false,
        simple: true,
        modalClass: ['pkm-totonoo-modal-simple'],
        onOk () {
          store.fileRemove(id).then(res => {
            getList(page.value, pagesize.value)
          }).catch(err => {
            msg.error(err.message)
          })
        }
      })
    }
    const successHandler = () => {
      getList(1, pagesize.value)
    }
    getList(page.value, pagesize.value)

    return {
      list,
      total,
      page,
      pagesize,
      pageChangeHandler,
      copyHandler,
      openHandler,
      visible,
      removeHandler,
      successHandler,

      dayjs
    }
  }
})
</script>
