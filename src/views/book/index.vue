<template>
  <div class="book">
    <pkm-page-header title="书架" subtitle="存放已买已读已听的书，省得每次买重复了">
      <template #extra>
        <pkm-input-search :style="{width:'320px'}" placeholder="Please enter something" loading />
      </template>
    </pkm-page-header>
    <div class="tabs">
      <pkm-tabs default-active-key="1">
        <template #extra>
          <pkm-button type="primary">
            <template #icon>
              <icon-plus />
            </template>
          </pkm-button>
        </template>
        <pkm-tab-pane key="1" title="哲学">
          
          <pkm-image
            src='https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp'
            title='A user’s avatar'
            description='Present by Arco Design'
            width="240"
            style="margin: 20px 20px 20px 0; vertical-align: top;"
            :preview-visible="visible1"
            @preview-visible-change="() => { visible1= false }"
            v-for="i in 10"
            :key="i"
          >
            <template #extra>
              <div class="actions">
                <span class="action" @click="() => { visible1 = true }"><icon-eye /></span>
                <span class="action" @click="onDownLoad"><icon-download /></span>
                <a-tooltip content="A user’s avatar">
                  <span class="action"><icon-info-circle /></span>
                </a-tooltip>
              </div>
            </template>
          </pkm-image>

        </pkm-tab-pane>
        <pkm-tab-pane key="2" title="学习资料">
          <pkm-empty />
        </pkm-tab-pane>
        <pkm-tab-pane key="3" title="交叉学科">
          <pkm-empty />
        </pkm-tab-pane>
      </pkm-tabs>
    </div>

    <pkm-drawer :width="600" :visible="infoVisible" :ok-loading="posting" @ok="saveHandler" @cancel="hideDrawer" unmountOnClose>
      <template #title>
        文档信息
      </template>
      <pkm-form ref="formRef" :model="form" label-align="left">
        <pkm-form-item field="title" label="文档名称">
          <pkm-input v-model="form.title" placeholder="请输入文档名称" />
        </pkm-form-item>
        <pkm-form-item field="desc" label="文档简介">
          <pkm-textarea v-model="form.desc" placeholder="请输入文档简介" :max-length="200" show-word-limit />
        </pkm-form-item>
        <pkm-form-item field="tags" label="文档标签">
          <pkm-input-tag v-model="form.tags" placeholder="请输入文档标签" :max-tag-count="3" allow-clear/>
        </pkm-form-item>
        <pkm-form-item field="thumb" label="封面图片">
          <upload-image v-model="form.thumb" />
        </pkm-form-item>
        <pkm-form-item field="post" label="发布时间">
          <pkm-date-picker
            v-model="form.publishAt"
            placeholder="请选择发布时间"
            show-time
            format="YYYY-MM-DD hh:mm"
          />
        </pkm-form-item>
      </pkm-form>
    </pkm-drawer>

  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, computed, getCurrentInstance } from 'vue'
import { FormInstance } from '@arco-design/web-vue/es/form'
export default defineComponent({
  name: 'Book',
  setup () {
    const loading = ref<boolean>(true)
    const form = reactive({
      _id: '',
      title: '',
      desc: '',
      publishAt: new Date(),
      thumb: '',
      content: '',
      tags: []
    })
    const infoVisible = ref(true)
    const posting = ref(true)
    const formRef = ref<FormInstance | null>(null)
    const hideDrawer = () => {
      infoVisible.value = false
    }
    const showDrawer = () => {
      infoVisible.value = true
    }
    return {
      loading,
      form,
      infoVisible,
      posting,
      hideDrawer,
      saveHandler () {}
    }
  }
})
</script>
<style lang="scss" scoped>
.book {
  padding: 8px 0;
}
.tabs {
  padding: 0 32px;
}
</style>
