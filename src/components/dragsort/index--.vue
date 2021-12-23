<template>
  <div
    :id="id"
    class="pkm-drag-sort"
    @mousedown="mousedown($event)"
  >
    <ul
      class="pkm-drag-sort-drag-container"
      :class="listClass"
    >
      <li v-for="(item, index) in list" :key="index" class="sort-item" :data-index="index">
        <slot name="row" :row="item">
          {{ item.title }}
        </slot>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { v4 as uuidv4 } from 'uuid'

let timer: number | null = 0
export default defineComponent({
  props: {
    value: {
      type: Array,
      default: () => []
    },
    listClass: {
      type: Array,
      default: () => []
    },
    dragItemClassName: {
      type: String,
      default: 'sort-item'
    }
  },
  data () {
    const id = uuidv4()
    return {
      id: `pkm-sort-${id}`,
      list: [...this.value]
    }
  },
  watch: {
    value: function (val) {
      this.list = [...val]
    }
  },
  mounted () {

  },
  methods: {
    // 拖拽对象是否是 li.sort-item
    isDragItem (target: HTMLElement): boolean {
      return (target && target.nodeName === 'LI' && target.classList.contains(this.dragItemClassName))
    },
    // 不允许拖拽
    notAllowed (target: HTMLElement): boolean {
      return target.getAttribute('draggable') === 'false'
    },
    // 获取data-index
    dataIndex (target: HTMLElement): number {
      const index = target.dataset.index
      return index ? Number(index) : -1
    },
    closestLi (target: HTMLElement): HTMLElement | null {
      return target.closest(`li.${this.dragItemClassName}`)
    },
    swapList (drag: number, place: number) {
      if (drag !== place) {
        console.log(drag, place)
        timer = window.setTimeout(() => {
          const list = [...this.list]
          const item = list[drag]
          list.splice(drag, 1)
          list.splice(place, 0, item)
          this.list = [...list]
        }, 200)
      }
    },
    mousedown (event: MouseEvent) {
      event.preventDefault()
      const mouseTarget = event.target as HTMLElement
      if (this.notAllowed(mouseTarget)) {
        return
      }
      const drag = this.closestLi(mouseTarget)
      if (drag) {
        let dragBar = document.createElement('div')
        dragBar.classList.add('select')
        dragBar.style.left = drag.offsetLeft + 'px'
        dragBar.style.top = drag.offsetTop + 'px'
        dragBar.style.height = drag.clientHeight + 'px'
        dragBar.style.display = 'none'

        const box = document.querySelector(`#${this.id}`)
        box?.appendChild(dragBar)

        const dragIndex = this.dataIndex(drag)
        const mousemove = (event: MouseEvent) => {
          let moveTarget = event.target as HTMLElement
          if (!this.notAllowed(moveTarget)) {
            const over = this.closestLi(moveTarget)
            if (over) {
              const overIndex = this.dataIndex(over)
              dragBar.style.display = 'block'
              dragBar.style.left = over.offsetLeft + 'px'
              dragBar.style.top = over.offsetTop + 'px'

              console.log(1111, timer)
              if (timer) {
                window.clearTimeout(timer)
                timer = null
              }
              this.swapList(dragIndex, overIndex)
              // console.log(overIndex)
            }
          }
        }
        document.addEventListener('mousemove', mousemove, false)
        const mouseup = () => {
          box?.removeChild(dragBar)
          document.removeEventListener('mousemove', mousemove)
          document.removeEventListener('mouseup', mouseup)
        }
        document.addEventListener('mouseup', mouseup, false)
      }
    }
  }
})
</script>
<style lang="scss">
.pkm-drag-sort {
  position: relative;
  user-select: none;
  .select {
    position: absolute;
    width: 100%;
    display: block;
    border: 1px rgb(var(--primary-6)) dashed;
    background-color: rgba(0,0,0, 0.01);
    cursor: pointer;
    color: #ffffff;
    box-sizing: border-box;
    opacity: 0.8;
    transition: all 260ms ease;
  }
}
</style>
