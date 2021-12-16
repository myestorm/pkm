<template>
  <div class="pkm-side-footer">
    <pkm-dropdown>
      <div class="link"><icon-user :strokeWidth="strokeWidth" /></div>
      <template #content>
        <pkm-doption @click="info">
          <template #icon>
            <icon-info-circle style="margin-right: 8px;" />
          </template>
          <template #default>我的信息</template>
        </pkm-doption>
        <pkm-doption @click="signout">
          <template #icon>
            <icon-to-right style="margin-right: 8px;" />
          </template>
          <template #default>退出登录</template>
        </pkm-doption>
      </template>
    </pkm-dropdown>
    <router-link to="/" class="link"><icon-question-circle :strokeWidth="strokeWidth" /></router-link>
    <router-link to="/" class="link"><icon-settings :strokeWidth="strokeWidth" /></router-link>
  </div>
</template>
<script lang="ts">
import { defineComponent, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { useStore  } from '../../store'
export default defineComponent({
  name: 'SideFooter',
  setup () {
    const store = useStore()
    const router = useRouter()
    const app = getCurrentInstance()
    const modal = app?.appContext.config.globalProperties.$modal
    return {
      strokeWidth: 3,
      info () {
        router.push({
          path: '/userinfo'
        })
      },
      signout () {
        modal.open({
          title: '系统提示',
          content: `确定退出登录状态？`,
          hideCancel: false,
          simple: true,
          modalClass: ['pkm-modal-simple'],
          modalStyle: {
            width: '280px'
          },
          onOk () {
            store.dispatch('user/signout').then(() => {
              router.push({
                path: '/signin',
                query: {
                  refer: encodeURIComponent('/')
                }
              })
            })
          }
        })
      }
    }
  }
})
</script>
<style lang="scss" scoped>
.#{$--prefix}-side-footer {
  display: flex;
  padding: 16px;
  .link {
    color: var(--color-text-4);
    margin: 4px;
    font-size: 20px;
    transition: $--transition;
    cursor: pointer;
    &:hover {
      color: var(--color-text-1);
    }
  }
}
</style>