<template>
  <pkm-spin dot :loading="loading" class="pkm-totonoo-wh-100">
    <pkm-form ref="formRef" :model="form" label-align="right" :label-col-props="{ span: 4 }" :wrapper-col-props="{ span: 20 }">
      <template v-if="formType">
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
  </pkm-spin>
</template>
<script lang="ts">
import { defineComponent, PropType, ref, reactive, getCurrentInstance, computed, watchEffect } from 'vue'
import { FormInstance } from '@arco-design/web-vue/es/form'
import { ValidatedError } from '@arco-design/web-vue/es/form/interface'
import * as TypesBase from '@/types/base'
import * as TypesBook from '@/types/book'

import UploadImage from '@/components/upload/upload-image.vue'
import useBookStore from '@/store/book/index'

export interface BookFormProps {
  id: string,
  type: TypesBase.IBaseTypesType,
  directory: string[]
}

export default defineComponent({
  props: {
    id: {
      type: String as PropType<BookFormProps['id']>,
      default: ''
    },
    type: {
      type: String as PropType<BookFormProps['type']>,
      default: TypesBase.IBaseTypesType.FILE
    },
    directory: {
      type: Array as PropType<BookFormProps['directory']>,
      default: []
    }
  },
  emits: ['ready'],
  components: {
    UploadImage
  },
  setup (props, ctx) {
    const app = getCurrentInstance()
    const msg = app?.appContext.config.globalProperties.$message
    const documentStore = useBookStore()

    const loading = ref(false)

    const formRef = ref<FormInstance | null>(null)
    const form = reactive<TypesBook.IBookCreateType>({
      ...documentStore.getFormDefault
    })

    const setFormValue = (data: TypesBook.IBookType) => {
      form.title = data.title
      form.directory = data.directory
      form.cover = data.cover
      form.desc = data.desc
      form.tags = data.tags
      form.type = data.type
      form.author = data.author
      form.readed = data.readed
      form.heard = data.heard
      form.purchased = data.purchased
      form.ISBN = data.ISBN
      form.rating = data.rating
    }

    const formType = computed(() => {
      return form.type === TypesBase.IBaseTypesType.FILE
    })

    const submit = () => {
      return new Promise((resolve, reject) => {
        formRef.value?.validate((errors: undefined | Record<string, ValidatedError>) => {
          if (!errors) {
            let postData = {
              ...form
            }
            loading.value = true
            const action = props.id ? documentStore.bookUpdate(props.id, postData) : documentStore.bookCreate(postData)
            action.then((res) => {
              resolve(res)
            }).catch(err => {
              msg.error(err.message)
              reject(err)
            }).finally(() => {
              loading.value = false
            })
          } else {
            reject(errors)
          }
        })
      })
    }

    const getFormValue = () => {
      return form
    }

    
    if (props.id) {
      loading.value = true
      documentStore.bookInfo(props.id).then(res => {
        if (res.data) {
          setFormValue(res.data)
          ctx.emit('ready', res.data)
        }
      }).catch(err => {
        msg.error(err.message)
      }).finally(() => {
        loading.value = false
      })
    } else {
      form.directory = props.directory || []
      form.type = props.type || TypesBase.IBaseTypesType.FILE
    }

    return {
      loading,
      formRef,
      formType,
      form,
      submit,
      getFormValue,
      setFormValue
    }
  }
})
</script>
