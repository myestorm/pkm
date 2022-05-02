<template>
  <pkm-layout-header class="pkm-totonoo-header">
    <div class="left">
      <pkm-breadcrumb :style="{ fontSize: '14px' }" :max-count="6">
        <pkm-breadcrumb-item>
          <router-link to="/home"><icon-home /></router-link>
        </pkm-breadcrumb-item>
        <pkm-breadcrumb-item v-for="(breadcrumb, index) in breadcrumbs" :key="breadcrumb.url" @click="toLink(breadcrumb.url)">
          <router-link :to="breadcrumb.url" v-if="index != breadcrumbs.length - 1">{{ breadcrumb.title }}</router-link>
          <template v-else>
            {{ breadcrumb.title }}
          </template>
        </pkm-breadcrumb-item>
        <template #separator>
          <icon-right />
        </template>
      </pkm-breadcrumb>
    </div>
    <div class="right">
      <pkm-space>
        <pkm-dropdown>
          <div class="user-info">
            <pkm-avatar :size="28" shape="square">
              <img
                v-if="userinfo.avatar"
                alt="avatar"
                :src="userinfo.avatar"
              />
              <template v-else>
                {{userinfo.username?.charAt(0).toUpperCase()}}
              </template>
            </pkm-avatar>
            {{ userinfo.nickname || userinfo.username }}
            <icon-down />
          </div>
          <template #content>
            <pkm-doption @click="visibleAccount = true">
              <template #icon>
                <icon-info-circle />
              </template>
              <template #default>我的信息</template>
            </pkm-doption>
            <pkm-doption @click="visible = true">
              <template #icon>
                <icon-edit />
              </template>
              <template #default>修改密码</template>
            </pkm-doption>
            <pkm-doption @click="logoutHandler">
              <template #icon>
                <icon-export />
              </template>
              <template #default>退出登录</template>
            </pkm-doption>
          </template>
        </pkm-dropdown>
        <pkm-button shape="circle" @click="changeThemeHandler(!isDark)">
          <icon-sun-fill v-if="isDark" />
          <icon-moon-fill v-else />
        </pkm-button>
      </pkm-space>
      <change-password v-model="visible" width="380px" @success="changePasswordSuccessHandler" />
      <change-account-info v-model="visibleAccount" width="380px" @success="changeAccountInfoSuccessHandler" />
    </div>
  </pkm-layout-header>
</template>
<script lang="ts">
import { defineComponent, ref, getCurrentInstance } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import changePassword from '@/views/components/admin/change-password.vue'
import changeAccountInfo from '@/views/components/admin/change-account-info.vue'
import useStore from '@/store/index'
import useAdminStore from '@/store/admin/index'

import * as TypesAdmin from '@/types/admin'

export default defineComponent({
  components: {
    changePassword,
    changeAccountInfo
  },
  setup () {
    const app = getCurrentInstance()
    const msg = app?.appContext.config.globalProperties.$message
    const modal = app?.appContext.config.globalProperties.$modal
    const store = useStore()
    const storeAdmin = useAdminStore()
    const router = useRouter()
    const { breadcrumbs } = storeToRefs(store)
    const { userinfo } = storeToRefs(storeAdmin)
    
    const isDark = ref(store.theme === 'dark')
    const visible = ref(false)
    const visibleAccount = ref(false)
    const changeThemeHandler = (val: boolean) => {
      if (val) {
        document.body.setAttribute('arco-theme', 'dark')
      } else {
        document.body.removeAttribute('arco-theme')
      }
      store.setTheme(val ? 'dark' : 'light')
      isDark.value = val
    }
    const changePasswordSuccessHandler = (data: TypesAdmin.IAdminChangePasswordType) => {
      storeAdmin.signout().then(_ => {
        router.push('/signin')
      }).catch(err => {
        msg.error(err.message)
      })
    }
    const changeAccountInfoSuccessHandler = (data: TypesAdmin.IAdminChangeAccountInfoType) => {
      userinfo.value.avatar = data.avatar || userinfo.value.avatar
      userinfo.value.nickname = data.nickname || userinfo.value.nickname
      userinfo.value.email = data.email || userinfo.value.email
      userinfo.value.mobile = data.mobile || userinfo.value.mobile
    }
    const logoutHandler = () => {
      modal.open({
        title: '系统提示',
        content: `确定需要退出当前用户？`,
        hideCancel: false,
        simple: true,
        modalClass: ['pkm-totonoo-modal-simple'],
        onOk () {
          storeAdmin.signout().then(_ => {
            router.push('/signin')
          }).catch(err => {
            msg.error(err.message)
          })
        }
      })
    }
    const toLink = (url: string) => {
      router.push(url)
    }
    return {
      userinfo,
      breadcrumbs,
      isDark,
      visible,
      visibleAccount,
      changeThemeHandler,
      changePasswordSuccessHandler,
      changeAccountInfoSuccessHandler,
      logoutHandler,
      toLink
    }
  }
})
</script>
<style lang="scss" scoped>
.#{$--prefix}-header {
  display: flex;
  padding: 8px 16px;
  align-items: center;
  .left {
    flex: 1;
  }
  .right {
    color: var(--color-text-2)
  }
}
</style>
