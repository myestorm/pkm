<template>
  <mobile-layout title="系统设置" subtitle="基础数据配置" :back="pageBack" class="setting">
    <template #main>
      <pkm-space direction="vertical" fill>
        <div class="user-box">
          <div class="user-info">
            <pkm-avatar>
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
          </div>
          <pkm-button type="text" status="success" @click="visible = true"><icon-lock /></pkm-button>
          <pkm-button type="text" status="success" @click="visibleInfo = true"><icon-edit /></pkm-button>
          <change-password v-model="visible" @success="changePasswordSuccessHandler" />
          <change-account-info v-model="visibleInfo" :initValue="userinfo" @success="changeAccountInfoSuccessHandler" />
        </div>
        <pkm-collapse :default-active-key="activeKey" expand-icon-position="right">
          <pkm-collapse-item header="系统设置" key="1" disabled :show-expand-icon="false">
            <div class="line">
              <div class="label">黑暗模式</div>
              <div class="item">
                <pkm-switch v-model="isDark" @change="changeHandler" />
              </div>
            </div>
          </pkm-collapse-item>
          <pkm-collapse-item header="数据备份还原" key="2" :show-expand-icon="false">
            <pkm-space direction="vertical" fill>
              <pkm-button type="outline" long @click="bakHandler">备份数据</pkm-button>
              <pkm-input-group class="pkm-totonoo-flex">
                <pkm-select v-model="folder" flex="auto" :options="bakList" placeholder="请选择要还原的目录" />
                <pkm-button type="primary" status="danger" @click="restoreHandler">还原数据</pkm-button>
              </pkm-input-group>
            </pkm-space>
          </pkm-collapse-item>
        </pkm-collapse>
        <pkm-button type="outline" long @click="adminHandler">用户管理</pkm-button>
        <pkm-button type="outline" status="danger" long @click="logoutHandler">退出登录</pkm-button>
      </pkm-space>
    </template>
  </mobile-layout>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, getCurrentInstance } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import MobileLayout from '@/components/layout/mobile-layout.vue'
import ChangePassword from '@/views/components/admin/change-password.vue'
import ChangeAccountInfo from '@/views/components/admin/change-account-info.vue'
import useStore from '@/store/index'
import useAdminStore from '@/store/admin/index'
import * as TypesAdmin from '@/types/admin'

export default defineComponent({
  components: {
    MobileLayout,
    ChangePassword,
    ChangeAccountInfo
  },
  setup () {
    const app = getCurrentInstance()
    const msg = app?.appContext.config.globalProperties.$message
    const modal = app?.appContext.config.globalProperties.$modal
    const store = useStore()
    const storeAdmin = useAdminStore()
    const router = useRouter()
    const isDark = ref(store.theme === 'dark')
    const activeKey = reactive(['1'])
    const visible = ref(false)
    const visibleInfo = ref(false)

    const { userinfo } = storeToRefs(storeAdmin)
    const changeHandler = (val: boolean) => {
      if (val) {
        document.body.setAttribute('arco-theme', 'dark')
      } else {
        document.body.removeAttribute('arco-theme')
      }
      store.setTheme(val ? 'dark' : 'light')
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
    const pageBack = () => {
      router.push('/m/home')
    }
    const adminHandler = () => {
      router.push('/m/admin')
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

    getList()

    return {
      userinfo,
      pageBack,
      isDark,
      activeKey,
      changeHandler,
      logoutHandler,
      adminHandler,
      visible,
      visibleInfo,
      changePasswordSuccessHandler,
      changeAccountInfoSuccessHandler,

      bakList,
      bakHandler,
      folder,
      restoreHandler
    }
  }
})
</script>
<style lang="scss" scoped>
.setting {
  .user-box {
    width: 100%;
    display: flex;
    align-items: center;
    color: var(--color-text-1);
    .user-info {
      flex: 1;
    }
  }
  .line {
    display: flex;
    padding: 4px 0;
    .label {
      flex: 0 0 72px;
      padding-right: 12px;
      &::after {
        content: "："
      }
    }
    .item {
      flex: 1;
    }
  }
}
</style>
<style lang="scss">
.setting {
  .arco-collapse-item-content {
    background-color: var(--color-bg-2) !important;
  }
}
</style>
