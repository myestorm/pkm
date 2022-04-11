<template>
  <div class="pkm-page-signin">
    <div class="pkm-page-signin-bg">
      <pkm-form :model="form" class="login-form" ref="signinFormRef" @submit="submit">
        <pkm-form-item :hide-label="true">
          <TotonooLogo />
        </pkm-form-item>
        <pkm-form-item field="username" label="用户" :hide-label="true" :rules="[{ required: true, message: '请输入用户名/手机/邮箱' }]">
          <pkm-input v-model="form.username" placeholder="用户名/手机/邮箱" />
        </pkm-form-item>
        <pkm-form-item field="password" label="密码" :hide-label="true" >
          <pkm-input-password v-model="form.password" placeholder="请输入登录密码" />
        </pkm-form-item>
        <pkm-form-item :hide-label="true">
          <pkm-button type="primary" long html-type="submit" :loading="loading" :disabled="loading">立 即 登 录</pkm-button>
        </pkm-form-item>
      </pkm-form>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, getCurrentInstance } from 'vue'
import { MD5 } from 'crypto-js'
import { ValidatedError } from '@arco-design/web-vue/es/form/interface'
import { FormInstance } from '@arco-design/web-vue/es/form'
import { useRoute } from 'vue-router'
import useAdminStore from '../../store/modules/admin/index'
import TotonooLogo from '../../components/totonoo-logo/index.vue'

export default defineComponent({
  components: {
    TotonooLogo
  },
  setup () {
    const storeAdmin = useAdminStore()
    const route = useRoute()
    const app = getCurrentInstance()
    const msg = app?.appContext.config.globalProperties.$message

    const refer = <string>route.query.refer || '/'

    const form = reactive({
      username: '',
      password: ''
    })
    const signinFormRef = ref<FormInstance>()
    const loading = ref(false)
    const submit = () => {
      signinFormRef.value?.validate((errors: undefined | Record<string, ValidatedError>) => {
        if (!errors) {
          loading.value = true
          const postData = {
            ...form
          }
          postData.password = MD5(postData.password).toString()
          storeAdmin.signin(postData).then(() => {
            window.location.href = decodeURIComponent(refer)
          }).catch(err => {
            msg.error(err.message)
          }).then(() => {
            loading.value = false
          })
        }
      })
    }
    return {
      loading,
      signinFormRef,
      form,
      submit
    }
  }
})
</script>
<style lang="scss" scoped>
.#{$--prefix}-page-signin {
  width: 100%;
  height: 100%;
  background-image: url(../../assets/bg/green.jpg);
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  .#{$--prefix}-page-signin-bg {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(8px);
    background-color: rgba(0,0,0, 0.12);
    .login-form {
      max-width: 320px;
      box-sizing: border-box;
      padding: 0 32px;
      width: 100%;
    }
  }
}
</style>
