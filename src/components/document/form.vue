<template>
  <pkm-form ref="formRef" :model="form" label-align="right" :label-col-props="{ span: 4 }" :wrapper-col-props="{ span: 20 }">
    <template v-if="formType">
      <pkm-form-item field="title" label="名称" required :rules="[{ required: true, message: '请填写名称'}]">
        <pkm-input v-model="form.title" placeholder="请填写名称" />
      </pkm-form-item>
      <pkm-form-item field="desc" label="简介">
        <pkm-textarea v-model="form.desc" placeholder="请填写简介" :max-length="800" show-word-limit />
      </pkm-form-item>
      <pkm-form-item field="cover" label="封面">
        <upload-image v-model="form.cover" />
      </pkm-form-item>
      <pkm-form-item field="tags" label="标签">
        <pkm-input-tag v-model="form.tags" placeholder="请填写标签" :max-tag-count="3" allow-clear/>
      </pkm-form-item>
    </template>
    <template v-else>
      <pkm-form-item field="title" label="名称" required :rules="[{ required: true, message: '请填写名称'}]">
        <pkm-input v-model="form.title" placeholder="请填写名称" />
      </pkm-form-item>
      <pkm-form-item field="desc" label="简介">
        <pkm-textarea v-model="form.desc" placeholder="请填写简介" :max-length="800" show-word-limit />
      </pkm-form-item>
    </template>
  </pkm-form>
</template>
<script lang="ts">
import { defineComponent, PropType, ref, reactive, getCurrentInstance, computed } from 'vue'
import { FormInstance } from '@arco-design/web-vue/es/form'
import { ValidatedError } from '@arco-design/web-vue/es/form/interface'
import * as TypesBase from '@/types/base'
import * as TypesDocument from '@/types/document'

import UploadImage from '@/components/upload/upload-image.vue'
import useDocumentStore from '@/store/modules/document/index'

export interface DocumentFormProps {
  id: string
}

export default defineComponent({
  name: 'FileForm',
  props: {
    id: {
      type: String as PropType<DocumentFormProps['id']>,
      default: ''
    }
  },
  emits: [],
  components: {
    UploadImage
  },
  setup (props, ctx) {
    const app = getCurrentInstance()
    const msg = app?.appContext.config.globalProperties.$message
    const documentStore = useDocumentStore()

    const formRef = ref<FormInstance | null>(null)
    const form = reactive<TypesDocument.IDocumentFileFormType>({
      ...documentStore.getFormDefault
    })

    const setFormValue = (data: TypesDocument.IDocumentType) => {
      form._id = data._id
      form.title = data.title
      form.cover = data.cover
      form.desc = data.desc
      form.tags = data.tags
      form.type = data.type
    }

    const formType = computed(() => {
      return form.type === TypesBase.IBaseTypesType.FILE
    })

    if (props.id) {
      documentStore.getInfo(props.id).then(res => {
        if (res.data) {
          setFormValue(res.data)
        }
      }).catch(err => {
        msg.error(err.message)
      })
    } else {
      setFormValue(documentStore.getFormDefault)
    }

    const submit = () => {
      return new Promise((resolve, reject) => {
        formRef.value?.validate((errors: undefined | Record<string, ValidatedError>) => {
          if (!errors) {
            let postData = {
              ...form
            }
            documentStore.submitForm(postData).then((res) => {
              resolve(res)
            }).catch(err => {
              msg.error(err.message)
              reject(err)
            })
          }
        })
      })
    }

    const getFormValue = () => {
      return form
    }

    const creatDocument = () => {
      setFormValue({
        ...documentStore.getFormDefault,
        type: TypesBase.IBaseTypesType.FILE
      })
    }

    const creatFolder = () => {
      setFormValue({
        ...documentStore.getFormDefault,
        type: TypesBase.IBaseTypesType.FOLDER
      })
    }

    return {
      formRef,
      formType,
      form,
      submit,
      getFormValue,
      setFormValue,
      creatDocument,
      creatFolder
    }
  }
})
</script>
