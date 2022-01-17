<template>
  <div class="book-info">
    <pkm-page-header title="永恒的十字架" subtitle="氨基末端的">
      <div class="info-detail">
        <div class="image">
          <img src="https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg">
        </div>
        <!-- <div class="list">
          <h1>平凡的世界 - <span>路遥</span></h1>
          <p>那个时代虽然过去了，但作者对生活入木十分的观察仍值得借鉴。故事虽然植根于农村，但哪个城市的人不是来自农村？即使是这本书里的人物们，他们也不一定一直生活在农村。所以，这本书的意义将不会随着城市化的深入而泯灭。 </p>
          <dl>
            <dt>ISBN</dt>
            <dd>7020063519</dd>
          </dl>
          <dl>
            <dt>标签</dt>
            <dd>7020063519</dd>
          </dl>
          <dl>
            <dt>状态</dt>
            <dd>
              <pkm-space>
                <pkm-checkbox v-model="form.readed">已读</pkm-checkbox>
                <pkm-checkbox v-model="form.heard">已听</pkm-checkbox>
                <pkm-checkbox v-model="form.purchased">已买</pkm-checkbox>
              </pkm-space>
            </dd>
          </dl>
          <dl>
            <dt>评价</dt>
            <dd><pkm-rate v-model="form.rating" allow-half allow-clear /></dd>
          </dl>
        </div> -->
      </div>
      <div class="notes">
        <pkm-timeline :reverse="isReverse">
          <pkm-timeline-item label="2017-03-10">The first milestone</pkm-timeline-item>
          <pkm-timeline-item label="2018-05-12">The second milestone</pkm-timeline-item>
          <pkm-timeline-item label="2020-09-30">The third milestone</pkm-timeline-item>
        </pkm-timeline>
      </div>
    </pkm-page-header>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, computed, getCurrentInstance } from 'vue'
import { IBookType } from '../../../types/bookrack'
import { useStore  } from '../../store'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'bookInfo',
  setup () {
    const store = useStore()
    const route = useRoute()
    const msg = app?.appContext.config.globalProperties.$message
    const groupId = <string>route.query.groupId
    const id = <string>route.query.id

    const info = reactive<IBookType>()
    const getInfo = (gid, bid) => {
      store.dispatch('bookrack/bookInfo', {
        groupId: gid,
        id: bid
      }).then((res) => {
        console.log(res)
        if (res) {
          info = {
            ...res
          }
        }
      }).catch(err => {
        msg.error(err.message)
      })
    }
    getInfo(groupId, id)

    return {
      info
    }
  }
})
</script>
