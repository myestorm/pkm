<template>
  <div class="pkm-side-header">
    <div class="logo">
      <a href="/">
        <img src="../../assets/logo/logo.svg">
      </a>
    </div>
    <h1 class="name">Totonoo</h1>
    <pkm-dropdown position="br" class="pkm-more-dropdown">
      <pkm-button size="mini">
        <template #icon>
          <icon-more-vertical />
        </template>
      </pkm-button>
      <template #content>
        <pkm-doption class="pkm-more-doption">偏好设置</pkm-doption>
        <pkm-doption class="pkm-more-doption">关于系统</pkm-doption>
      </template>
    </pkm-dropdown>
  </div>
  <div class="pkm-side-header-action">
    <pkm-button type="primary" long @click.stop="toggleAction">
      <template #icon>
        <icon-plus />
      </template>
      <template #default>
        新建
      </template>
    </pkm-button>
    <div class="add-button-options" v-show="isDisplay">
      <pkm-button long @click="showSelectKnowledgeDrawer">
        <template #icon>
          <icon-file />
        </template>
        <template #default>
          <span class="w">文档</span>
        </template>
      </pkm-button>
      <pkm-button long @click="showKnowledgeDrawer">
        <template #icon>
          <icon-folder />
        </template>
        <template #default>
          <span class="w">知识库</span>
        </template>
      </pkm-button>
    </div>
  </div>
  <pkm-drawer :width="360" :ok-loading="loading" :visible="visibleKnowledge" @ok="submitKnowledge" @cancel="hideKnowledgeDrawer" unmountOnClose>
    <template #title>
      新建知识库
    </template>
    <pkm-form :model="form" ref="knowledgeFormRef">
      <pkm-form-item field="title" label="名称" :rules="[{ required: true, message: '请输入知识库名称' }]">
        <pkm-input v-model="form.title" placeholder="请输入知识库名称" :max-length="20" show-word-limit />
        <template #help>
          <div>尽量保持10以内的汉字</div>
        </template>
      </pkm-form-item>
      <pkm-form-item field="desc" label="简介" :rules="[{ required: true, message: '请输入知识库简介' }]">
        <pkm-textarea v-model="form.desc" placeholder="请输入知识库简介" :max-length="200" show-word-limit />
      </pkm-form-item>
    </pkm-form>
  </pkm-drawer>

  <select-knowledge v-model="visibleSelectKnowledge" title="新建文档" desc="请选择目标知识库" @ok="toDocumentLink" />
</template>
<script lang="ts">
import { defineComponent, ref, computed, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { useStore  } from '../../store'

import { IKnowledgeType, IKnowledgeDocType } from '../../../types/knowledge'
import { ValidatedError } from '@arco-design/web-vue/es/form/interface'
import { FormInstance } from '@arco-design/web-vue/es/form'

import SelectKnowledge from '../../components/select-knowledge/index.vue'

export default defineComponent({
  name: 'SideHeader',
  components: {
    SelectKnowledge
  },
  setup () {
    const store = useStore()
    const router = useRouter()
    const app = getCurrentInstance()
    const msg = app?.appContext.config.globalProperties.$message

    const isDisplay = ref(false) // 新建按钮的菜单控制
    const visibleKnowledge = computed(() => store.getters.getVisibleKnowledge) // 是否显示新建知识库抽屉
    const form = computed(() => store.getters.getKnowledgeForm)

    const knowledgeFormRef = ref<FormInstance | null>(null) // 新建知识库的表单
    const loading = ref(false) // 新建知识库的按钮loading状态

    // 隐藏新建按钮的菜单
    const hideAction = () => {
      isDisplay.value = false
      document.removeEventListener('click', hideAction)
    }
    const showAction = () => {
      isDisplay.value = true
      document.addEventListener('click', hideAction)
    }
    const toggleAction = () => {
      if (isDisplay.value) {
        hideAction()
      } else {
        showAction()
      }
    }

    // 隐藏新建知识库的抽屉
    const hideKnowledgeDrawer = () => {
      knowledgeFormRef.value?.clearValidate()
      knowledgeFormRef.value?.resetFields()
      store.commit('setVisibleKnowledge', false)
    }
    const showKnowledgeDrawer = () => {
      store.commit('setVisibleKnowledge', true)
    }
    // 新建菜单接口
    const addKnowledge = (postData: IKnowledgeType<string>) => {
      knowledgeFormRef.value?.validate((errors: undefined | Record<string, ValidatedError>) => {
        if (!errors) {
          loading.value = true
          const url = postData._id ? 'knowledge/update' : 'knowledge/add'
          store.dispatch(url, {
            ...postData
          }).then(() => {
            hideKnowledgeDrawer()
            msg.success(`操作成功${postData.title}`)
          }).catch(err => {
            msg.error(err.message)
          }).then(() => {
            loading.value = false
          })
        }
      })
    }
    const submitKnowledge = () => {
      addKnowledge({
        ...form.value
      })
    }

    // 新建文档
    const visibleSelectKnowledge = ref(false)
    const hideSelectKnowledgeDrawer = () => {
      visibleSelectKnowledge.value = false
    }
    const showSelectKnowledgeDrawer = () => {
      visibleSelectKnowledge.value = true
    }
    const toDocumentLink = (id: string) => {
      if (id) {
        hideSelectKnowledgeDrawer()
        router.push(`/document/${id}/add`)
      }
    }
    
    return {
      isDisplay,
      hideAction,
      showAction,
      toggleAction,
      visibleKnowledge,
      hideKnowledgeDrawer,
      showKnowledgeDrawer,
      loading,
      knowledgeFormRef,
      form,
      submitKnowledge,
      visibleSelectKnowledge,
      hideSelectKnowledgeDrawer,
      showSelectKnowledgeDrawer,
      toDocumentLink
    }
  }
})
</script>
<style lang="scss" scoped>
.#{$--prefix}-side-header {
  display: flex;
  align-items: center;
  padding: 8px;
  .logo {
    img {
      width: 36px;
    }
  }
  .name {
    @include reset();
    flex: 1;
    color: var(--color-text-1);
    font-size: 16px;
    text-align: center;
    text-transform: uppercase;
  }
  button {
    background-color: transparent;
    &:hover, &:focus {
      background-color: var(--color-secondary-hover);
    }
  }
}
.#{$--prefix}-side-header-action {
  margin: 0 8px 8px;
  position: relative;
  .add-button-options {
    width: 100%;
    position: absolute;
    left: 0;
    top: calc(100% + 4px);
    z-index: 9;
    box-sizing: border-box;
    padding: 4px 0;
    background-color: var(--color-bg-popup);
    border: 1px solid var(--color-fill-3);
    border-radius: var(--border-radius-medium);
    box-shadow: 0 4px 10px #0000001a;
    button {
      background-color: transparent;
      &:hover {
        color: var(--color-text-2);
        background-color: var(--color-secondary-hover);
      }
      .w {
        display: inline-block;
        text-align: left;
        width: 60px;
      }
    }
  }
}
</style>
