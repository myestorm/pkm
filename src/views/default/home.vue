<template>
  <div class="home">
    <pkm-card :bordered="false" class="pkm-totonoo-home-card">
      <pkm-card-grid class="item">
        <pkm-card
          class="card"
          title="DEMO文件上传"
          :bordered="false"
        >
          <pkm-space direction="vertical" fill>
            <upload-unzip />
            <pkm-button long @click="toLink('/filelist')">管理DEMO文件</pkm-button>
          </pkm-space>
        </pkm-card>
      </pkm-card-grid>
      <pkm-card-grid class="item">
        <pkm-card
          class="card"
          title="数据备份"
          :bordered="false"
        >
          <pkm-space direction="vertical" fill>
            <pkm-button type="primary" long @click="bakHandler">备份数据</pkm-button>
            <pkm-input-group class="pkm-totonoo-flex">
              <pkm-select v-model="folder" flex="auto" :options="bakList" placeholder="请选择要还原的目录" />
              <pkm-button type="primary" status="danger" @click="restoreHandler">还原数据</pkm-button>
            </pkm-input-group>
          </pkm-space>
        </pkm-card>
      </pkm-card-grid>
    </pkm-card>
  </div>
</template>
<script lang="ts">
import { defineComponent, getCurrentInstance, ref } from 'vue'
import useStore from '@/store/index'
import { useRouter } from 'vue-router'

import UploadUnzip from '@/components/upload/upload-unzip.vue'

export default defineComponent({
  name: 'Home',
  components: {
    UploadUnzip
  },
  setup () {
    const app = getCurrentInstance()
    const msg = app?.appContext.config.globalProperties.$message
    const modal = app?.appContext.config.globalProperties.$modal
    const store = useStore()
    const router = useRouter()
    const bakList = ref<string[]>([])
    const folder = ref('')

    const getList = () => {
      store.bakDataList().then(res => {
        bakList.value = res.data || []
      }).catch(err => {
        msg.error(err.message)
      })
    }

    const bakHandler = (id: string) => {
      modal.open({
        title: '系统提示',
        content: `该操作会备份所有的数据，可能会比较慢，是否继续？`,
        hideCancel: false,
        simple: true,
        modalClass: ['pkm-totonoo-modal-simple'],
        onOk () {
          store.bakData().then(_ => {
            msg.success('备份数据成功')
            getList()
          }).catch(err => {
            msg.error(err.message)
          })
        }
      })
    }

    const restoreHandler = () => {
      if (folder.value) {
        modal.open({
          title: '系统提示',
          content: `该操作会先删除所有的数据再，还原当前目录数据，可能会出错，也可能会比较缓慢，是否继续？`,
          hideCancel: false,
          simple: true,
          modalClass: ['pkm-totonoo-modal-simple'],
          onOk () {
            store.restoreData(folder.value).then(_ => {
              msg.success('还原数据成功')
            }).catch(err => {
              msg.error(err.message)
            })
          }
        })
      } else {
        msg.error('还原的目录不能为空！')
      }
    }

    const toLink = (path: string) => {
      router.push(path)
    }

    getList()
    return {
      bakList,
      bakHandler,
      folder,
      restoreHandler,
      toLink
    }
  }
})
</script>
<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 16px;
}
.#{$--prefix}-home-card {
  width: 100%;
  height: 100%;
  .item {
    width: 25%;
    .card {
      width: 100%;
    }
  }
}
</style>
