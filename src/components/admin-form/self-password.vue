<template>
  <pkm-drawer :width="width" :visible="modelValue" :ok-loading="loading" @ok="save" @cancel="handleCancel" unmountOnClose>
    <template #title>
      修改密码
    </template>
    <pkm-form ref="formRef" :model="form" label-align="right" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
      <pkm-form-item field="oldPassword" label="旧的密码" :rules="checkOldPassword">
        <pkm-input-password v-model="form.oldPassword" placeholder="请填写旧的密码" />
      </pkm-form-item>
      <pkm-form-item field="password" label="新的密码" :rules="checkPassword">
        <pkm-input-password v-model="form.password" placeholder="请填写新的密码" />
      </pkm-form-item>
      <pkm-form-item field="repeatPassword" label="再输一次" :rules="checkReaptePassword">
        <pkm-input-password v-model="form.repeatPassword" placeholder="请再输一次新密码" />
      </pkm-form-item>
    </pkm-form>
  </pkm-drawer>
</template>
<script lang="ts">
import { defineComponent, PropType, ref, reactive, CSSProperties, getCurrentInstance } from 'vue'
import { MD5 } from 'crypto-js'
import { FormInstance } from '@arco-design/web-vue/es/form'
import { ValidatedError } from '@arco-design/web-vue/es/form/interface'
import useAdminStore from '../../store/modules/admin/index'
import * as TypesAdmin from '../../../types/admin'

export interface FileFormDrawerProps {
  width: CSSProperties['width'],
  modelValue: boolean
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
    }
  },
  emits: ['update:modelValue', 'success'],
  setup (props, ctx) {
    const app = getCurrentInstance()
    const msg = app?.appContext.config.globalProperties.$message
    const formRef = ref<FormInstance | null>(null)
    const store = useAdminStore()
    const formDefault = {
      password: '',
      oldPassword: '',
      repeatPassword: ''
    }
    const form = reactive<TypesAdmin.IApiAdminUpdateSelfPasswordType>({
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
            password: MD5(form.password).toString(),
            oldPassword: MD5(form.oldPassword).toString(),
            repeatPassword: MD5(form.repeatPassword).toString()
          }
          loading.value = true
          store.updateSelfPassword(postData).then(() => {
            handleCancel()
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
      required: true,
      message:'新的密码不能为空'
    }, {
      minLength: 6,
      message:'密码最少6个字符'
    }]

    const checkReaptePassword = [{
      required: true,
      message:'确认密码不能为空'
    }, {
      minLength: 6,
      message:'密码最少6个字符'
    }, {
      validator: (value: string, cb: (err?: string) => void) => {
        if (form.password !== value) {
          cb('两次输入的密码不一致')
        } else {
          cb()
        }
      }
    }]

    const checkOldPassword = [{
      required: true,
      message:'旧的密码不能为空'
    }, {
      minLength: 6,
      message:'密码最少6个字符'
    }, {
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
      checkReaptePassword,
      checkOldPassword
    }
  }
})
</script>
