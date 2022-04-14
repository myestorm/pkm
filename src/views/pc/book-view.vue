<template>
  <div class="pkm-book-info">
    <book-info :id="id" drawerWidth="60%" @edit="edit" />
    <book-form-drawer width="420px" v-model="visible" :id="id" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
import useBookStore from '../../store/modules/book/index'
import BookInfo from '../../components/book-info/index.vue'
import BookFormDrawer from '../../components/book-form/drawer.vue'

export default defineComponent({
  components: {
    BookInfo,
    BookFormDrawer
  },
  setup () {
    const route = useRoute()
    const storeBook = useBookStore()
    const { id } = route.params as { parents: string[], id: string }
    const visible = ref(false)
    storeBook.id = id

    const edit = () => {
      visible.value = true
    }
    return {
      id,
      visible,
      edit
    }
  },
})
</script>
<style lang="scss" scoped>
.pkm-book-info {
  padding: 16px 32px;
  max-width: 720px;
}
</style>
