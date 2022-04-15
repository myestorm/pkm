<template>
  <pkm-drawer :width="width" :visible="modelValue" :ok-loading="loading" @ok="save" @cancel="handleCancel" unmountOnClose>
    <template #title>
      修改用户信息
    </template>
    <pkm-form ref="formRef" :model="form" label-align="right" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
      <pkm-form-item field="oldPassword" label="旧的密码" :rules="checkOldPassword">
        <pkm-input-password v-model="form.oldPassword" placeholder="请填写旧的密码，不修改请留空" />
      </pkm-form-item>
      <pkm-form-item field="password" label="新的密码" :rules="checkPassword">
        <pkm-input-password v-model="form.password" placeholder="请填写新的密码，不修改请留空" />
      </pkm-form-item>
      <pkm-form-item field="repeatPassword" label="再输一次" :rules="checkPassword">
        <pkm-input-password v-model="form.repeatPassword" placeholder="请再输一次新密码" />
      </pkm-form-item>
      <pkm-form-item field="nickname" label="用户昵称">
        <pkm-input v-model="form.nickname" placeholder="请填写用户昵称" />
      </pkm-form-item>
      <pkm-form-item field="avatar" label="用户头像">
        <upload-image v-model="form.avatar" />
      </pkm-form-item>
    </pkm-form>
  </pkm-drawer>
</template>
<script lang="ts">
import { defineComponent, PropType, ref, reactive, CSSProperties, getCurrentInstance } from 'vue'
import { MD5 } from 'crypto-js'
import { FormInstance } from '@arco-design/web-vue/es/form'
import { ValidatedError } from '@arco-design/web-vue/es/form/interface'
import { IApiAdminUpdateSelfType } from '../../../types/admin'
import UploadImage from '../../components/upload/upload-image.vue'

import { AdminUpdateSelf } from '../../apis/admin'

export interface FileFormDrawerProps {
  width: CSSProperties['width'],
  modelValue: boolean,
  initValue: IApiAdminUpdateSelfType
}

export default defineComponent({
  name: 'FileFormDrawer',
  props: {
    width: {
      type: String as PropType<FileFormDrawerProps['width']>,
      default: '100%'
    },
    modelValue: {
      type: Boolean as PropType<FileFormDrawerProps['modelValue']>,
      default: false
    },
    initValue: {
      type: Object as PropType<FileFormDrawerProps['initValue']>,
      default: () => {}
    }
  },
  components: {
    UploadImage
  },
  emits: ['update:modelValue', 'success'],
  setup (props, ctx) {
    const app = getCurrentInstance()
    const msg = app?.appContext.config.globalProperties.$message
    const formRef = ref<FormInstance | null>(null)
    const formDefault = {
      password: '',
      avatar: props.initValue?.avatar || '',
      nickname: props.initValue?.nickname || '',
      oldPassword: '',
      repeatPassword: ''
    }
    const form = reactive<IApiAdminUpdateSelfType>({
      ...formDefault,
    })
    const loading = ref(false)
    const getFormValue = () => {
      return form
    }
    const handleCancel = () => {
      ctx.emit('update:modelValue', false)
    }

    const save = () => {
      formRef.value?.validate((errors: undefined | Record<string, ValidatedError>) => {
        if (!errors) {
          const postData = {
            ...form
          }
          if (postData.password) {
            postData.password = MD5(postData.password).toString()
          } else {
            delete postData.password
          }
          if (postData.oldPassword) {
            postData.oldPassword = MD5(postData.oldPassword).toString()
          } else {
            delete postData.oldPassword
          }
          if (postData.repeatPassword) {
            postData.repeatPassword = MD5(postData.repeatPassword).toString()
          } else {
            delete postData.repeatPassword
          }
          loading.value = true
          AdminUpdateSelf(postData).then(() => {
            handleCancel()
            msg.success('更新成功，需重新登录后生效！')
            ctx.emit('success', postData)
          }).catch(err => {
            msg.error(err.message)
          }).finally(() => {
            loading.value = false
          })
        }
      })
    }

    const checkPassword = [{
      validator: (value: string, cb: (err?: string) => void) => {
        if (form.password !== form.repeatPassword) {
          cb('两次输入的密码不一致')
        } else {
          cb()
        }
      }
    }]

    const checkOldPassword = [{
      validator: (value: string, cb: (err?: string) => void) => {
        if (form.password && !value) {
          cb('修改密码需要输入旧的密码')
        } else {
          cb()
        }
      }
    }]

    return {
      formRef,
      form,
      save,
      getFormValue,
      loading,
      handleCancel,
      checkPassword,
      checkOldPassword
    }
  }
})
</script>
