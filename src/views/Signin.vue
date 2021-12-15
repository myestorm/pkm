<template>
  <div class="pkm-page-signin">
    <div class="pkm-page-signin-bg">
      <pkm-form :model="form" class="login-form" ref="signinFormRef" @submit="submit">
        <pkm-form-item field="username" label="用户" :rules="[{ required: true, message: '请输入用户名/手机/邮箱' }]">
          <pkm-input v-model="form.username" placeholder="用户名/手机/邮箱" />
        </pkm-form-item>
        <pkm-form-item field="password" label="密码" :rules="[{ required: true, message: '请输入密码' }]">
          <pkm-input-password v-model="form.password" placeholder="请输入登录密码" />
        </pkm-form-item>
        <pkm-form-item>
          <pkm-button long html-type="submit" :loading="loading" :disabled="loading">立 即 登 录</pkm-button>
        </pkm-form-item>
      </pkm-form>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, getCurrentInstance } from 'vue'
import { ValidatedError } from '@arco-design/web-vue/es/form/interface'
import { FormInstance } from '@arco-design/web-vue/es/form'
import { useRouter, useRoute } from 'vue-router'
import { useStore  } from '../store'

export default defineComponent({
  setup () {
    const store = useStore()
    const router = useRouter()
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
          store.dispatch('user/signin', {
            ...form
          }).then(() => {
            router.push(refer)
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
  background-image: url(../assets/bg/green.jpg);
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  .#{$--prefix}-page-signin-bg {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(32px);
    background-color: rgba(0,0,0, 0.8);
    .login-form {
      max-width: 468px;
      width: 100%;
    }
  }
}
</style>
