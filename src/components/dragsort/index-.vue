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

interface IItemType {
  target: HTMLElement | null,
  animating: boolean,
  animateTimer: number
}

interface IDataType {
  id: string,
  drag: HTMLElement | null,
  observer: MutationObserver | null,
  list: any[]
}

export interface IDragSortChangeType<T> {
  old: number,
  index: number,
  data: T,
  list: T[]
}

let dragItems: IItemType[] = []

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
    dragClassName: {
      type: String,
      default: 'drag'
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
      drag: null,
      list: [...this.value],
      observer: null
    } as IDataType
  },
  watch: {
    value: async function (val) {
      this.list = [...val]
      await this.$nextTick()
      this.setItems()
    }
  },
  mounted () {
    this.setItems()

    // 监听dom变化
    this.observer = new MutationObserver(this.change.bind(this))
    const box = document.querySelector(`#${this.id}`)
    if (box) {
      this.observer.observe(box, { attributes: false, childList: true, subtree: true })
    }
  },
  methods: {
    getItems () {
      const box = document.querySelector(`#${this.id}`)
      const items = box?.querySelectorAll('.sort-item')
      return items
    },
    setItems () {
      const list = []
      const items = this.getItems()
      if (items) {
        for (let i = 0; i < items.length; i++) {
          const item = items[i] as HTMLElement
          list.push({
            target: item,
            animating: false,
            animateTimer: 0
          })
        }
      }
      dragItems = [ ... list ]
    },
    // 查找节点在父节点中的索引值
    findIndex (target: HTMLElement): number {
      let index = 0
      if (!target || !target.parentNode) {
        index = -1
      } else {
        const nodes = Array.prototype.slice.call(target.parentNode.children)
        index = nodes.indexOf(target)
      }
      return index
    },
    animate (target: IItemType, translateY: number) {
      return new Promise<void>((reslove) => {
        if (target && target.target) {
          const duration = 260
          target.target.style.transition = `all ${duration}ms ease`
          target.target.style.transform = `translateY(${translateY}px)`
          if (target.animateTimer) {
            clearTimeout(target.animateTimer)
          }
          target.animating = true
          target.animateTimer = window.setTimeout(() => {
            if (target && target.target) {
              target.target.style.transition = ''
              target.target.style.transform = 'translateY(0px)'
            }
            target.animating = false
            reslove()
          }, duration)
        } else {
          reslove()
        }
      })
    },
    getValue () {
      const list = []
      const children = this.getItems()
      if (children) {
        for (let i = 0; i < children.length; i++) {
          const child = children[i] as HTMLElement
          const index = Number(child.dataset.index)
          if (index > -1) {
            const val = this.list[index]
            if (typeof val === 'object') {
              const _val = JSON.parse(JSON.stringify(val))
              list.push(_val)
            } else {
              list.push(val)
            }
          }
        }
      }
      return list
    },
    // 拖拽对象是否是 li.sort-item
    isDragItem (target: HTMLElement) {
      return (target && target.nodeName === 'LI' && target.classList.contains(this.dragItemClassName))
    },
    // 不允许拖拽
    notAllowed (target: HTMLElement) {
      return target.getAttribute('draggable') === 'false'
    },
    change () {
      console.log(1)
      if (this.drag) {
        console.log(2)
        const oldIndex = Number(this.drag.dataset.index)
        const index = this.findIndex(this.drag)
        const curr = this.list[oldIndex]
        const list = this.getValue()
        this.$emit('change', {
          old: oldIndex,
          index: index,
          data: curr,
          list
        })
        this.list = [...list]
      }
    },
    mousedown (event: MouseEvent) {
      const _target = event.target as HTMLElement
      if (this.notAllowed(_target)) {
        return
      }
      const drag = (!this.isDragItem(_target) ? _target.closest(`li.${this.dragItemClassName}`) : _target) as HTMLElement
      const box = document.querySelector(`#${this.id}`)
      let isMoving = false
      if (drag && box) {

        let dragBar = document.createElement('div')
        dragBar.classList.add('select')
        dragBar.style.left = drag.offsetLeft + 'px'
        dragBar.style.top = drag.offsetTop + 'px'
        dragBar.style.height = drag.clientHeight + 'px'
        dragBar.style.display = 'none'
        
        box.appendChild(dragBar)
        this.drag = drag

        const mousemoveHandler = async (event: MouseEvent) => {
          const _moveTarget = event.target as HTMLElement
          const target = (this.isDragItem(_moveTarget) ?  _moveTarget : _moveTarget.closest(`li.${this.dragItemClassName}`)) as HTMLElement
          if (!target) {
            return false
          }
          
          isMoving = true
          dragBar.style.display = 'block'

          if (this.isDragItem(target)) {

            dragBar.style.left = target.offsetLeft + 'px'
            dragBar.style.top = target.offsetTop + 'px'

            const dragIndex = this.findIndex(drag)
            const overIndex = this.findIndex(target)
            const _dragIndex = Number(drag.dataset.index)
            const _overIndex = Number(target.dataset.index)

            if (target.parentNode && dragIndex > -1 && overIndex > -1 && dragIndex !== overIndex) {
              if (dragItems[_dragIndex] && dragItems[_dragIndex].animating) {
                return
              }
              const referenceNode = (dragIndex < overIndex ? target.nextSibling : target) as HTMLElement
              const translateY = drag.offsetTop - target.offsetTop

              await Promise.all([this.animate(dragItems[_dragIndex], translateY * -1), this.animate(dragItems[_overIndex], translateY)])

              target.parentNode.insertBefore(drag, referenceNode)
            }

          }
        }
        document.addEventListener('mousemove', mousemoveHandler, false)

        const mouseupHandler = () => {
          isMoving = false
          box.removeChild(dragBar)
          document.removeEventListener('mousemove', mousemoveHandler)
          document.removeEventListener('mouseup', mouseupHandler)
        }
        document.addEventListener('mouseup', mouseupHandler, false)
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
