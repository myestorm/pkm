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
import { defineComponent, ref, reactive, getCurrentInstance } from 'vue'
import { FormInstance, } from '@arco-design/web-vue/es/form'
import { ValidatedError } from '@arco-design/web-vue/es/form/interface'
import UploadImage from '../../components/upload/upload-image.vue'

import useCommonStore from '../../store'

// import {
//   IApisBookUpdateType
// } from '../../../types/bookrack'

export default defineComponent({
  name: 'BookForm',
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:loading', 'success', 'fail'],
  components: {
    UploadImage
  },
  setup (props, ctx) {
    // const store = useStore()
    const app = getCurrentInstance()
    const msg = app?.appContext.config.globalProperties.$message

    const formRef = ref<FormInstance | null>(null)
    const formDefault = {
      _id: '',
      groupId: '',
      title: '',
      author: '',
      cover: '',
      desc: '',
      readed: false,
      heard: false,
      purchased: false,
      ISBN: '',
      tags: [],
      rating: 3,
      order: 99,
      children: []
    }
    let form = reactive<any>({
      ...formDefault
    })

    const save = () => {
      formRef.value?.validate((errors: undefined | Record<string, ValidatedError>) => {
        if (!errors) {
          ctx.emit('update:loading', true)
          const url = form?._id ? 'bookrack/bookUpdate' : 'bookrack/bookAdd'
          const postData = {
            ...form
          }
          if (!postData._id) {
            delete postData._id
          }
          // store.dispatch(url, postData).then(() => {
          //   ctx.emit('success', true)
          // }).catch(err => {
          //   msg.error(err.message)
          //   ctx.emit('fail', err)
          // }).then(() => {
          //   ctx.emit('update:loading', false)
          // })
        }
      })
    }

    
    const setFormValue = (groupId: string, data: any) => {
      form._id = data._id
      form.groupId = groupId
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

    const getFormValue = () => {
      return form
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
