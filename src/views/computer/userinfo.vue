<template>
  <div class="userinfo">
    <pkm-page-header title="用户信息" subtitle="Totonoo Personal Knowledge Management 0.0.2" @back="back">
      <template #extra>
        <pkm-button type="primary" @click="editor">
          <template #icon>
            <icon-edit />
          </template>
          更新信息
        </pkm-button>
      </template>
      <pkm-descriptions :data="data" title="用户信息" layout="vertical" />
    </pkm-page-header>
    <admin-self-info v-model="visible" width="380px" :initValue="userinfo" @success="successHandler" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import useStore from '../../store/modules/admin/index'

import * as TypesAdmin from '../../../types/admin'
import AdminSelfInfo from '../../components/admin-form/self-info.vue'

export default defineComponent({
  components: {
    AdminSelfInfo
  },
  setup () {
    const store = useStore()
    const router = useRouter()
    const { userinfo } = storeToRefs(store)
    const visible = ref(false)
    const successHandler = (data: TypesAdmin.IApiAdminUpdateSelfInfoType) => {
      userinfo.value.avatar = data.avatar || userinfo.value.avatar
      userinfo.value.nickname = data.nickname || userinfo.value.nickname
      userinfo.value.email = data.email || userinfo.value.email
      userinfo.value.mobile = data.mobile || userinfo.value.mobile
    }
    const editor = () => {
      visible.value = true
    }
    const data = computed(() => {
      return [{
        label: '用户名',
        value: userinfo.value.username,
      }, {
        label: 'UID',
        value: userinfo.value._id,
      }, {
        label: '昵称',
        value: userinfo.value.nickname
      }, {
        label: '手机',
        value: userinfo.value.mobile,
      }, {
        label: '邮件',
        value: userinfo.value.email
      }]
    })
    return {
      userinfo,
      visible,
      successHandler,
      editor,
      data,
      back () {
        router.push('/p/home')
      }
    }
  }
})
</script>