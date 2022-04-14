<template>
  <div class="userinfo">
    <pkm-page-header title="用户信息" subtitle="Totonoo Personal Knowledge Management 0.0.2" @back="back">
      <pkm-descriptions :data="data" title="用户信息" layout="vertical" />
    </pkm-page-header>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import useStore from '../../store/modules/admin/index'

export default defineComponent({
  setup () {
    const store = useStore()
    const router = useRouter()
    const { userinfo } = storeToRefs(store)
    return {
      data: [{
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
      }],
      back () {
        router.push('/p/home')
      }
    }
  }
})
</script>