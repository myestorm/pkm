<template>
  <mobile-layout title="书架" subtitle="如何形成清晰的观点" :footer="false">
      <template #main>
        <pkm-space direction="vertical" class="book-info" size="medium">
          <h1>{{info.title}} - <span>{{info.author}}</span></h1>
          <div class="desc">
            <img :src="info.cover || '/images/no-book.png'">
            <pkm-typography-text type="secondary">
              {{info.desc}}
            </pkm-typography-text>
          </div>
          <dl>
            <dt>ISBN</dt>
            <dd>{{info.ISBN}}</dd>
          </dl>
          <dl>
            <dt>标签</dt>
            <dd>
              <pkm-space>
                <pkm-tag v-for="(tag, index) in info.tags" :key="index">{{tag}}</pkm-tag>
              </pkm-space>
            </dd>
          </dl>
          <dl>
            <dt>状态</dt>
            <dd>
              <pkm-space>
                <pkm-checkbox v-model="info.readed" disabled>已读</pkm-checkbox>
                <pkm-checkbox v-model="info.heard" disabled>已听</pkm-checkbox>
                <pkm-checkbox v-model="info.purchased" disabled>已买</pkm-checkbox>
              </pkm-space>
            </dd>
          </dl>
          <dl>
            <dt>评价</dt>
            <dd><pkm-rate v-model="info.rating" allow-half readonly /></dd>
          </dl>
        </pkm-space>
        <div class="notes">
          <pkm-typography-title :heading="5" flex="auto">笔记</pkm-typography-title>
          <div class="btn">
            <pkm-button type="primary" shape="circle" size="large" @click="addHandler">
              <template #icon>
                <icon-plus />
              </template>
            </pkm-button>
          </div>
          <pkm-timeline>
            <pkm-timeline-item v-for="(note, index) in info.children" :key="index" :label="formatTime(note.updatedAt)" class="pkm-timeline-item">
              <div v-html="Md2html(note.content)"></div>
              <div class="action">
                <pkm-button type="text" @click="eidtHandler(index)">
                  <template #icon>
                    <icon-edit />
                  </template>
                </pkm-button>
                <pkm-button type="text" @click="deleteHandler(index)">
                  <template #icon>
                    <icon-delete />
                  </template>
                </pkm-button>
              </div>
            </pkm-timeline-item>
          </pkm-timeline>
        </div>
      </template>
  </mobile-layout>
</template>
<script lang="ts">
import { defineComponent, getCurrentInstance, ref } from 'vue'

import MobileLayout from '../../components/layout/mobile-layout.vue'
import BookForm from '../../components/book-form/index.vue'
import Md2html from '../../components/editor/parser/md2html'


export default defineComponent({
  components: {
    MobileLayout,
    BookForm
  },
  setup () {
    const app = getCurrentInstance()
    const formatTime = app?.appContext.config.globalProperties.$formatTime
    const data = {"code":0,"msg":"success","data":{"title":"如何形成清晰的观点","author":"[美] 查尔斯·S.皮尔士","cover":"","desc":"在人们的思维活动中，有许多种想法，却不知怎样表达。该如何形成自己清晰的观点？这种观点又是怎样决定人们的习惯从而影响人们的现实生活？什么样的观点是有效的观点？","readed":false,"heard":false,"purchased":true,"ISBN":"9787545549928","tags":["深度思考","逻辑推理","准确表达"],"rating":3,"order":99,"children":[{"content":"第二条","order":99,"createdAt":"2022-02-17T06:53:55.264Z","updatedAt":"2022-02-17T06:53:55.264Z","_id":"623058b9670d6255fb226324"},{"content":"如何形成清晰的观点\n\n测试笔记","order":99,"createdAt":"2022-02-17T06:53:55.264Z","updatedAt":"2022-02-17T06:53:55.264Z","_id":"62305898670d6255fb226316"}],"createdAt":"2022-01-19T06:23:27.083Z","updatedAt":"2022-03-15T09:13:29.252Z","_id":"61ebc03825a74f80cb2f7004"}}
    return {
      formatTime,
      Md2html,
      info: data.data
    }
  },
})
</script>
<style lang="scss">
.book-info {
  color: var(--color-text-1);
  text-align: justify;
  h1 {
    @include reset();
  }
  dl {
    @include reset();
    display: flex;
    align-items: center;
  }
  .desc {
    display: flex;
    align-items: flex-start;
  }
  img {
    width: 80px;
    border: 1px solid var(--color-neutral-3);
    margin-right: 20px;
    display: inline-block;
  }
  .notes {
    .btn {
      position: fixed;
      right: 0;
      bottom: 0;
    }
  }
  .pkm-timeline-item {
    position: relative;
    .action {
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }
}
</style>
