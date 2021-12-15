<template>
  <div class="pkm-page-signin">
    <div class="pkm-page-signin-bg">
      <pkm-form :model="form" class="login-form">
        <pkm-form-item field="username" label="用户">
          <pkm-input v-model="form.username" placeholder="用户名/手机/邮箱" />
        </pkm-form-item>
        <pkm-form-item field="password" label="密码">
          <pkm-input-password v-model="form.password" placeholder="请输入登录密码" />
        </pkm-form-item>
        <pkm-form-item>
          <pkm-button long>立 即 登 录</pkm-button>
        </pkm-form-item>
      </pkm-form>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue'

export default defineComponent({
  setup () {
    const form = reactive({
      username: '',
      password: ''
    })
    return {
      form
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
