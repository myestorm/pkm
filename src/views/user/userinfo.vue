<template>
  <pkm-space>
    <pkm-descriptions :data="data" title="用户信息" layout="inline-horizontal"/>
  </pkm-space>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore  } from '../../store'

export default defineComponent({
  setup () {
    const store = useStore()
    const userinfo = computed(() => store.getters['user/userinfo'])
    return {
      data: [{
        label: 'Name',
        value: 'Socrates',
      }, {
        label: 'Mobile',
        value: '123-1234-1234',
      }, {
        label: 'Residence',
        value: 'Beijing'
      }, {
        label: 'Hometown',
        value: 'Beijing',
      }, {
        label: 'Address',
        value: 'Yingdu Building, Zhichun Road, Beijing'
      }]
    }
  }
})
</script>