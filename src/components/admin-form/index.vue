<template>
  <pkm-drawer :width="width" :visible="modelValue" :ok-loading="loading" @ok="save" @cancel="handleCancel" unmountOnClose>
    <template #title>
      用户管理
    </template>
    <pkm-form ref="formRef" :model="form" label-align="right" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
      <pkm-form-item field="username" label="登录账号" required :rules="[{ required: true, message: '请填写登录账号'}]">
        <pkm-input v-model="form.username" placeholder="请填写登录账号" />
      </pkm-form-item>
      <pkm-form-item field="password" label="初始密码" required :rules="[{ required: true, message: '请填写初始密码'}]">
        <pkm-input-password v-model="form.password" placeholder="请填写初始密码" />
      </pkm-form-item>
      <pkm-form-item field="nickname" label="用户昵称" required :rules="[{ required: true, message: '请填写用户昵称'}]">
        <pkm-input v-model="form.nickname" placeholder="请填写用户昵称" />
      </pkm-form-item>
      <pkm-form-item field="email" label="电子邮箱" required :rules="[{ required: true, message: '请填写电子邮箱'}]">
        <pkm-input v-model="form.email" placeholder="请填写电子邮箱" />
      </pkm-form-item>
      <pkm-form-item field="mobile" label="手机号码" required :rules="[{ required: true, message: '请填写手机号码'}]">
        <pkm-input v-model="form.mobile" placeholder="请填写手机号码" />
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
import { IApiAdminAddType } from '../../../types/admin'
import UploadImage from '../../components/upload/upload-image.vue'

import { AdminAdd } from '../../apis/admin'

export interface FileFormDrawerProps {
  width: CSSProperties['width'],
  modelValue: boolean,
  initValue: IApiAdminAddType
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
      username: '',
      password: '',
      avatar: '',
      nickname: '',
      mobile: '',
      email: ''
    }
    const form = reactive<IApiAdminAddType>({
      ...formDefault,
      ...props.initValue
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
          postData.password = MD5(postData.password).toString()
          loading.value = true
          AdminAdd(postData).then(() => {
            handleCancel()
            ctx.emit('success')
          }).catch(err => {
            msg.error(err.message)
          }).finally(() => {
            loading.value = false
          })
        }
      })
    }

    return {
      formRef,
      form,
      save,
      getFormValue,
      loading,
      handleCancel
    }
  }
})
</script>
