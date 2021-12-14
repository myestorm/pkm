<template>
  <pkm-drawer :width="width" :ok-button-props="{
    disabled: !selected
  }" placement="left" :visible="modelValue" @ok="okHandler" @cancel="hideDrawer" unmountOnClose>
    <template #title>
      {{ title }}
    </template>
    <div class="pkm-select-knowledge">
      <p class="tips">{{ desc }}</p>
      <div class="pkm-flex-scroll-container list">
        <div class="scroll-body">
          <pkm-radio-group direction="vertical" style="width: 100%" v-model="selected">
            <pkm-radio v-for="item in collections" :key="item.id" :value="item._id">{{ item.title }}</pkm-radio>
          </pkm-radio-group>
        </div>
      </div>
    </div>
  </pkm-drawer>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useStore  } from '../../store'
export default defineComponent({
  emits: ['update:modelValue', 'cancel', 'ok'],
  props: {
    modelValue: {
      type: Boolean,
      defaut: false
    },
    width: {
      type: Number,
      default: 360
    },
    title: {
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    }
  },
  setup (props, ctx) {
    const store = useStore()
    const collections = computed(() => store.getters['knowledge/getList'])
    const selected = ref('')
    const hideDrawer = () => {
      ctx.emit('update:modelValue', false)
    }
    const showDrawer = () => {
      ctx.emit('update:modelValue', true)
      ctx.emit('cancel', selected.value)
    }
    const okHandler = () => {
      ctx.emit('ok', selected.value)
    }

    return {
      selected,
      collections,
      hideDrawer,
      showDrawer,
      okHandler
    }
  }
})
</script>
<style lang="scss" scoped>
.#{$--prefix}-select-knowledge {
  width: 100%;
  height: 96%;
  display: flex;
  flex-direction: column;
  .list {
    flex: 1;
  }
}
</style>
