<template>
  <pkm-page-header title="系统" subtitle="管理员管理" :show-back="false">
    <template #extra>
      <pkm-button type="primary" @click="add">
        <template #icon>
          <icon-plus />
        </template>
        <template #default>
          添加用户
        </template>
      </pkm-button>
    </template>
    <pkm-table :data="list" :pagination="false">
      <template #columns>
        <pkm-table-column title="用户名" data-index="username"></pkm-table-column>
        <pkm-table-column title="昵称" data-index="nickname"></pkm-table-column>
        <pkm-table-column title="头像" data-index="avatar">
          <template #cell="{ record }">
            <pkm-avatar :size="32">
              <img
                alt="avatar"
                :src="record.avatar"
              />
            </pkm-avatar>
          </template>
        </pkm-table-column>
        <pkm-table-column title="手机号码" data-index="mobile"></pkm-table-column>
        <pkm-table-column title="电子邮箱" data-index="email"></pkm-table-column>
        <pkm-table-column title="状态" data-index="status">
          <template #cell="{ record }">
            <pkm-tag color="gray" v-if="record.status == 0">禁用</pkm-tag> 
            <pkm-tag color="green" v-else>启用</pkm-tag> 
          </template>
        </pkm-table-column>
        <pkm-table-column title="操作">
          <template #cell="{ record }">
            <pkm-button-group>
              <pkm-button type="outline" size="mini" @click="disabled(record._id, 1)" v-if="record.status == 0">启用</pkm-button>
              <pkm-button type="outline" size="mini" @click="disabled(record._id, 0)" v-else>禁用</pkm-button>
              <pkm-button type="outline" size="mini" @click="resetPassword(record._id)">重置密码</pkm-button>
            </pkm-button-group>
          </template>
        </pkm-table-column>
      </template>
    </pkm-table>
    <admin-form width="420px" v-model="visible" @success="successHandler" />
  </pkm-page-header>
</template>
<script lang="ts">
import { defineComponent, getCurrentInstance, ref } from 'vue'
import AdminForm from '../../components/admin-form/index.vue'

import * as TypesAdmin from '../../../types/admin'
import useAdminStore from '../../store/modules/admin/index'
export default defineComponent({
  components: {
    AdminForm
  },
  setup () {
    const app = getCurrentInstance()
    const msg = app?.appContext.config.globalProperties.$message
    const modal = app?.appContext.config.globalProperties.$modal
    const storeAdmin = useAdminStore()

    const list = ref<TypesAdmin.IApiAdminReurnType[]>([])
    const visible = ref(false)

    const getList = () => {
      storeAdmin.list().then(res => {
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
        modalClass: ['pkm-modal-simple'],
        onOk () {
          storeAdmin.resetPassword(id).then(res => {
            msg.success(`密码已经重置为：${res.data}`)
          }).catch(err => {
            msg.error(err.message)
          })
        }
      })
    }
    const disabled = (id: string, status: number) => {
      modal.open({
        title: '系统提示',
        content: `确定要${ status === 0 ? '禁用' : '启用' }该用户？`,
        hideCancel: false,
        simple: true,
        modalClass: ['pkm-modal-simple'],
        onOk () {
          storeAdmin.disabled(id, status).then(res => {
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
      list,
      visible,
      add,
      successHandler,
      resetPassword,
      disabled
    }
  }
})
</script>
