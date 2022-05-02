<template>
  <mobile-layout title="用户管理" subtitle="系统用户管理" :footer="false" :back="pageBack" class="editor-page">
      <template #main>
        <pkm-list class="admin-list">
          <pkm-list-item v-for="item in list" :key="item.id">
            <pkm-list-item-meta class="meta">
              <template #avatar>
                <pkm-avatar shape="square">
                  <img alt="avatar" :src="item.avatar" v-if="item.avatar" />
                  <template v-else>
                    {{item.username?.charAt(0).toUpperCase()}}
                  </template>
                </pkm-avatar>
              </template>
              <template #title>
                {{ `用户名：${item.username} / 昵称：${item.nickname || '--'}` }}
              </template>
              <template #description>
                <div class="line">
                  手机号码：{{ item.mobile || '--'}}
                </div>
                <div class="line">
                  电子邮箱：{{ item.email || '--' }}
                </div>
                <div class="line line-action">
                  <pkm-button-group>
                    <pkm-button type="outline" size="mini" @click="disabled(item.id, 1)" v-if="item.status == 0">启用</pkm-button>
                    <pkm-button type="outline" size="mini" @click="disabled(item.id, 0)" v-else>禁用</pkm-button>
                    <pkm-button type="outline" size="mini" @click="resetPassword(item.id)">重置密码</pkm-button>
                  </pkm-button-group>
                </div>
              </template>
            </pkm-list-item-meta>
          </pkm-list-item>
        </pkm-list>
        <pkm-button type="primary" shape="circle" class="fix-btn" size="large" @click="add">
          <icon-plus />
        </pkm-button>
        <create-admin v-model="visible" @success="successHandler" />
      </template>
  </mobile-layout>
</template>
<script lang="ts">
import { defineComponent, ref, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'

import MobileLayout from '@/components/layout/mobile-layout.vue'
import CreateAdmin from '@/views/components/admin/create-admin.vue'

import * as TypesAdmin from '@/types/admin'
import useAdminStore from '@/store/admin/index'

export default defineComponent({
  components: {
    MobileLayout,
    CreateAdmin
  },
  setup () {
    const app = getCurrentInstance()
    const msg = app?.appContext.config.globalProperties.$message
    const modal = app?.appContext.config.globalProperties.$modal
    const router = useRouter()
    const storeAdmin = useAdminStore()
    const list = ref<TypesAdmin.IAdminType[]>([])
    const visible = ref(false)
    const pageBack = () => {
      router.push('/m/setting')
    }
    const getList = () => {
      storeAdmin.adminList().then(res => {
        list.value = res.data || []
      }).catch(err => {
        msg.error(err.message)
      })
    }
    const add = () => {
      visible.value = true
    }
    const successHandler = () => {
      getList()
    }
    const resetPassword = (id: string) => {
      modal.open({
        title: '系统提示',
        content: `确定要重置该用户的密码？`,
        hideCancel: false,
        simple: true,
        modalClass: ['pkm-totonoo-modal-simple'],
        onOk () {
          storeAdmin.adminResetPassword(id).then(res => {
            msg.success(`密码已经重置为：${res.data}`)
          }).catch(err => {
            msg.error(err.message)
          })
        }
      })
    }
    const disabled = (id: string, status: 0 | 1) => {
      modal.open({
        title: '系统提示',
        content: `确定要${ status === 0 ? '禁用' : '启用' }该用户？`,
        hideCancel: false,
        simple: true,
        modalClass: ['pkm-totonoo-modal-simple'],
        onOk () {
          storeAdmin.adminDisabled(id, status).then(res => {
            msg.success(`${ status === 0 ? '禁用' : '启用' }用户成功`)
            getList()
          }).catch(err => {
            msg.error(err.message)
          })
        }
      })
    }
    getList()
    return {
      pageBack,
      list,
      visible,
      add,
      successHandler,
      resetPassword,
      disabled
    }
  },
})
</script>
<style lang="scss" scoped>
.fix-btn {
  position: fixed;
  right: 16px;
  bottom: 16px;
}
.admin-list {
  background-color: var(--color-bg-2);
  .meta {
    align-items: flex-start;
  }
  .line {
    font-size: 12px;
  }
  .line-action {
    padding-top: 12px;
  }
}
</style>
