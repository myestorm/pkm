<template>
  <pkm-drawer :width="width" :visible="modelValue" :ok-loading="loading" @ok="submit" @cancel="handleCancel" unmountOnClose>
    <template #title>
      修改用户信息
    </template>
    <pkm-form ref="formRef" :model="form" label-align="right" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
      <pkm-form-item field="nickname" label="用户昵称" :rules="[{
        required: true,
        message:'用户昵称不能为空'
      }]">
        <pkm-input v-model="form.nickname" placeholder="请填写用户昵称" />
      </pkm-form-item>
      <pkm-form-item field="email" label="电子邮箱" :rules="checkEmail">
        <pkm-input v-model="form.email" placeholder="请填写电子邮箱" />
      </pkm-form-item>
      <pkm-form-item field="mobile" label="手机号码" :rules="checkMobile">
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
import { storeToRefs } from 'pinia'
import { FormInstance } from '@arco-design/web-vue/es/form'
import { ValidatedError } from '@arco-design/web-vue/es/form/interface'
import useAdminStore from '@/store/admin/index'
import * as TypesAdmin from '@/types/admin'
import UploadImage from '@/components/upload/upload-image.vue'

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
  components: {
    UploadImage
  },
  emits: ['update:modelValue', 'success'],
  setup (props, ctx) {
    const app = getCurrentInstance()
    const msg = app?.appContext.config.globalProperties.$message
    const storeAdmin = useAdminStore()
    const formRef = ref<FormInstance | null>(null)
    const { userinfo } = storeToRefs(storeAdmin) 
    const formDefault = {
      avatar: userinfo.value.avatar || '',
      nickname: userinfo.value.nickname || '',
      email: userinfo.value.email || '',
      mobile: userinfo.value.mobile || ''
    }
    const form = reactive<TypesAdmin.IAdminChangeAccountInfoType>({
      ...formDefault,
    })
    const loading = ref(false)
    const getFormValue = () => {
      return form
    }
    const handleCancel = () => {
      ctx.emit('update:modelValue', false)
    }

    const submit = () => {
      formRef.value?.validate((errors: undefined | Record<string, ValidatedError>) => {
        if (!errors) {
          const postData = {
            ...form
          }
          loading.value = true
          storeAdmin.changeAccountInfo(postData).then(() => {
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

    const checkEmail = [{
      required: true,
      message:'电子邮箱不能为空'
    }, {
      validator: (value: string, cb: (err?: string) => void) => {
        const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
        if (reg.test(value)) {
        } else {
          cb('请输入正确的电子邮箱')
        }
      }
    }]

    const checkMobile = [{
      required: true,
      message:'手机号码不能为空'
    }, {
      validator: (value: string, cb: (err?: string) => void) => {
        const reg = /^1(3[0-9]|5[0-3,5-9]|7[1-3,5-8]|8[0-9])\d{8}$/
        if (reg.test(value)) {
        } else {
          cb('请输入正确的手机号码')
        }
      }
    }]

    return {
      formRef,
      form,
      submit,
      getFormValue,
      loading,
      handleCancel,
      checkEmail,
      checkMobile
    }
  }
})
</script>
