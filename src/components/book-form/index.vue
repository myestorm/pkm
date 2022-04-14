<template>
  <pkm-form ref="formRef" :model="form" label-align="right" :label-col-props="{ span: 4 }" :wrapper-col-props="{ span: 20 }">
    <pkm-form-item field="title" label="名称" required :rules="[{ required: true, message: '请填写名称'}]">
      <pkm-input v-model="form.title" placeholder="请填写名称" />
    </pkm-form-item>
    <pkm-form-item field="author" label="作者">
      <pkm-input v-model="form.author" placeholder="请填写作者" />
    </pkm-form-item>
    <pkm-form-item field="desc" label="简介">
      <pkm-textarea v-model="form.desc" placeholder="请填写简介" :max-length="800" show-word-limit />
    </pkm-form-item>
    <pkm-form-item field="ISBN" label="ISBN">
      <pkm-input v-model="form.ISBN" placeholder="请填写ISBN" />
    </pkm-form-item>
    <pkm-form-item field="cover" label="封面">
      <upload-image v-model="form.cover" />
    </pkm-form-item>
    <pkm-form-item field="tags" label="标签">
      <pkm-input-tag v-model="form.tags" placeholder="请填写标签" :max-tag-count="3" allow-clear/>
    </pkm-form-item>
    <pkm-form-item field="readed" label="状态">
      <pkm-space>
        <pkm-checkbox v-model="form.readed">已读</pkm-checkbox>
        <pkm-checkbox v-model="form.heard">已听</pkm-checkbox>
        <pkm-checkbox v-model="form.purchased">已买</pkm-checkbox>
      </pkm-space>
    </pkm-form-item>
    <pkm-form-item field="rating" label="评价">
      <pkm-rate v-model="form.rating" allow-half allow-clear />
    </pkm-form-item>
  </pkm-form>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, getCurrentInstance, PropType } from 'vue'
import { FormInstance, } from '@arco-design/web-vue/es/form'
import { ValidatedError } from '@arco-design/web-vue/es/form/interface'
import UploadImage from '../../components/upload/upload-image.vue'

import { IBookDataFormType, IBookAddType, IBookUpdateType } from '../../../types/book'
import { BookAdd, BookUpdate, BookInfo } from '../../apis/book'

export interface BookFormPropType {
  id: string,
  loading: boolean
}

export default defineComponent({
  name: 'BookForm',
  props: {
    id: {
      type: String as PropType<BookFormPropType['id']>,
      default: ''
    },
    loading: {
      type: Boolean as PropType<BookFormPropType['loading']>,
      default: false
    }
  },
  emits: ['update:loading', 'success', 'fail', 'info'],
  components: {
    UploadImage
  },
  setup (props, ctx) {
    const app = getCurrentInstance()
    const msg = app?.appContext.config.globalProperties.$message

    const formRef = ref<FormInstance | null>(null)
    const formDefault = {
      _id: '',
      title: '',
      author: '',
      cover: '',
      desc: '',
      readed: false,
      heard: false,
      purchased: false,
      ISBN: '',
      tags: [],
      rating: 3
    }
    const form = reactive<IBookDataFormType>({
      ...formDefault
    })

    const setFormValue = (data: IBookDataFormType) => {
      form._id = data._id
      form.title = data.title
      form.author = data.author
      form.cover = data.cover
      form.desc = data.desc
      form.readed = data.readed
      form.heard = data.heard
      form.purchased = data.purchased
      form.ISBN = data.ISBN
      form.tags = data.tags
      form.rating = data.rating
    }

    const getInfo = (id: string) => {
      BookInfo(id).then(res => {
        if (res.data) {
          setFormValue(res.data)
          ctx.emit('info', res.data)
        }
      }).catch(err => {
        msg.error(err.message)
      })
    }

    const save = () => {
      formRef.value?.validate((errors: undefined | Record<string, ValidatedError>) => {
        if (!errors) {
          ctx.emit('update:loading', true)
          const postData = {
            ...form
          }
          if (!form._id) {
            delete postData._id
          }
          const action = form?._id ? BookUpdate(postData as IBookUpdateType) : BookAdd(postData as IBookAddType)
          action.then((res) => {
            ctx.emit('success', true)
            ctx.emit('info', res.data)
          }).catch(err => {
            msg.error(err.message)
            ctx.emit('fail', err)
          }).then(() => {
            ctx.emit('update:loading', false)
          })
        }
      })
    }

    const getFormValue = () => {
      return form
    }
    if (props.id) {
      getInfo(props.id)
    } else {
      setFormValue(formDefault)
    }

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
