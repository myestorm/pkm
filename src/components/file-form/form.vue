<template>
  <pkm-form ref="formRef" :model="form" label-align="right" :label-col-props="{ span: 4 }" :wrapper-col-props="{ span: 20 }">
    <template v-if="type == 'document'">
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
import { defineComponent, PropType, ref, reactive, getCurrentInstance } from 'vue'
import { FormInstance } from '@arco-design/web-vue/es/form'
import { ValidatedError } from '@arco-design/web-vue/es/form/interface'
import UploadImage from '../../components/upload/upload-image.vue'

import { IDocumentFormType, IDocumentAddType, IDocumentUpdateType, IDocumentTypeType } from '../../../types/document'
import { DocumentAdd, DocumentUpdate } from '../../apis/document'

export interface FileFormProps {
  loading: boolean;
  type: IDocumentTypeType,
  initVal: IDocumentFormType
}

export type SetFormValueType = Partial<IDocumentUpdateType>

export default defineComponent({
  name: 'FileForm',
  props: {
    loading: {
      type: Boolean as PropType<FileFormProps['loading']>,
      default: false
    },
    type: {
      type: String as PropType<FileFormProps['type']>,
      default: IDocumentTypeType.DOC
    },
    initValue: {
      type: Object as PropType<FileFormProps['initVal']>,
      default: () => {}
    }
  },
  emits: ['update:loading', 'success', 'fail'],
  components: {
    UploadImage
  },
  setup (props, ctx) {
    const app = getCurrentInstance()
    const msg = app?.appContext.config.globalProperties.$message

    const formRef = ref<FormInstance | null>(null)
    const formDefault = {
      _id: '',
      parents: [],
      title: '',
      type: props.type,
      authorId: '',
      cover: '',
      desc: '',
      content: '',
      tags: [],
      top: false
    }
    const form = reactive<IDocumentFormType>({
      ...formDefault
    })

    const save = () => {
      formRef.value?.validate((errors: undefined | Record<string, ValidatedError>) => {
        if (!errors) {
          ctx.emit('update:loading', true)
          let postData = {
            ...form
          }
          if (!postData._id) {
            delete postData._id
          }
          const action = postData._id ? DocumentUpdate(postData as IDocumentUpdateType) : DocumentAdd(postData as IDocumentAddType)
          action.then(() => {
            ctx.emit('success', true)
          }).catch(err => {
            msg.error(err.message)
            ctx.emit('fail', err)
          }).then(() => {
            ctx.emit('update:loading', false)
          })
        }
      })
    }

    
    const setFormValue = (data: SetFormValueType) => {
      if (data._id) {
        form._id = data._id
      }
      if (data.title) {
        form.title = data.title
      }
      if (data.cover) {
        form.cover = data.cover
      }
      if (data.desc) {
        form.desc = data.desc
      }
      if (data.tags) {
        form.tags = data.tags
      }
      if (data.parents) {
        form.parents = data.parents
      }
      if (data.type) {
        form.type = data.type
      }
      if (data.content) {
        form.content = data.content
      }
      if (data.top) {
        form.top = data.top
      }
    }

    const getFormValue = () => {
      return form
    }
    setFormValue(props.initValue)

    return {
      formRef,
      form,
      save,
      getFormValue,
      setFormValue
    }
  }
})
</script>
