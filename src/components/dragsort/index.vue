<template>
  <div
    :id="id"
    class="pkm-drag-sort"
    @mousedown="mousedownEvent($event)"
  >
    <ul
      class="pkm-drag-sort-ul"
      :class="[options.ulClass]"
    >
      <li v-for="(item, index) in list" :key="index" class="sort-item" :data-index="index" :class="[options.liClass]">
        <slot name="row" :row="item" :index="index">
          {{ item }}
        </slot>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch, nextTick } from 'vue'
import { v4 as uuidv4 } from 'uuid'

const dragItemClassName = 'sort-item'

const $ = (selector: string) => {
  return document.querySelector(selector)
}

// 拖拽对象是否是 li.sort-item
const isDragItem = (target: HTMLElement): boolean => {
  return (target && target.nodeName === 'LI' && target.classList.contains(dragItemClassName))
}

// 是否不允许拖拽
const notAllowed = (target: HTMLElement): boolean => {
  return target.getAttribute('draggable') === 'false'
}

// 获取data-index
const dataIndex = (target: HTMLElement): number => {
  const index = (target && target.dataset) ? target.dataset.index : -1
  return index ? Number(index) : -1
}

// 获取最近的 li.sort-item
const closestLi = (target: HTMLElement): HTMLElement | null => {
  return target.closest(`li.${dragItemClassName}`)
}

// 查找节点在父节点中的索引值
const findIndex = (target: HTMLElement): number => {
  let index = 0
  if (!target || !target.parentNode) {
    index = -1
  } else {
    const nodes = Array.prototype.slice.call(target.parentNode.children)
    index = nodes.indexOf(target)
  }
  return index
}

// 动画
const duration = 260
const animate = (target: HTMLElement, translateY: number) => {
  return new Promise<void>((reslove) => {
    if (target) {
      target.style.transition = `all ${duration}ms ease`
      target.style.transform = `translateY(${translateY}px)`
      window.setTimeout(() => {
        if (target) {
          target.style.transition = ''
          target.style.transform = 'translateY(0px)'
        }
        reslove()
      }, duration)
    } else {
      reslove()
    }
  })
}

export interface IChangeDataType<T> {
  drag: {
    old: number,
    index: number,
    data: T
  },
  target: {
    old: number,
    index: number,
    data: T
  },
  list: T[]
}

export default defineComponent({
  props: {
    value: {
      type: Array,
      default: () => []
    },
    options: {
      type: Object,
      default: () => {
        return {
          ulClass: [],
          liClass: []
        }
      }
    }
  },
  setup (props, ctx) {
    const uid = uuidv4()
    const id = `pkm-sort-${uid}`
    const list = ref<any[]>(props.value)

    watch(
      () => props.value,
      async (val) => {
        list.value = []
        await nextTick()
        list.value = val
      }
    )

    const getItems = () => {
      const box = $(`#${id}`)
      const items = box?.querySelectorAll(`.${dragItemClassName}`)
      return items
    }

    const getValue = () => {
      const _list = []
      const children = getItems()
      if (children) {
        for (let i = 0; i < children.length; i++) {
          const child = children[i] as HTMLElement
          const index = Number(child.dataset.index)
          if (index > -1) {
            const val = list.value[index]
            if (typeof val === 'object') {
              const _val = JSON.parse(JSON.stringify(val))
              _list.push(_val)
            } else {
              _list.push(val)
            }
          }
        }
      }
      return _list
    }

    const changeEvent = (drag: HTMLElement, target: HTMLElement) => {
      setTimeout(() => {
        const oldIndex = dataIndex(drag)
        const index = findIndex(drag)
        const curr = list.value[oldIndex]

        const tarOldIndex = dataIndex(target)
        const tarIndex = findIndex(target)
        const tarCurr = list.value[tarOldIndex]

        const res = getValue()
        if (oldIndex !== index) {
          ctx.emit('change', {
            drag: {
              old: oldIndex,
              index: index,
              data: curr
            },
            target: {
              old: tarOldIndex,
              index: tarIndex,
              data: tarCurr
            },
            list: res
          })
        }
      }, 300)
    }

    const mousedownEvent = (event: MouseEvent) => {
      const mouseTarget = event.target as HTMLElement
      if (notAllowed(mouseTarget)) {
        return
      }
      event.preventDefault()

      // 开始拖拽
      const drag = closestLi(mouseTarget)
      const box = $(`#${id}`)

      let movingTarget: HTMLElement

      let isMoving = false
      if (drag && box) {

        // 创建拖拽样子
        const dragBar = document.createElement('div')
        dragBar.classList.add('select')
        dragBar.style.left = drag.offsetLeft + 'px'
        dragBar.style.top = drag.offsetTop + 'px'
        dragBar.style.height = drag.clientHeight + 'px'
        dragBar.style.display = 'none'
        dragBar.style.transition = `all ${duration}ms ease`
        box.appendChild(dragBar)

        // 鼠标移动事件
        const mousemoveEvent = async (event: MouseEvent) => {
          if (isMoving) {
            return
          }
          isMoving = true
          const moveTarget = event.target as HTMLElement
          const target = closestLi(moveTarget)
          if (target && isDragItem(target)) {
            movingTarget = target
            dragBar.style.display = 'block'
            dragBar.style.left = target.offsetLeft + 'px'
            dragBar.style.top = target.offsetTop + 'px'

            const dragIndex = findIndex(drag)
            const overIndex = findIndex(target)
            if (target.parentNode && dragIndex > -1 && overIndex > -1 && dragIndex !== overIndex) {
              const referenceNode = (dragIndex < overIndex ? target.nextSibling : target) as HTMLElement
              const translateY = drag.offsetTop - target.offsetTop
              await Promise.all([animate(drag, translateY * -1), animate(target, translateY)])
              target.parentNode.insertBefore(drag, referenceNode)
            }
          }
          isMoving = false
        }
        document.addEventListener('mousemove', mousemoveEvent, false)
        
        const mouseupEvent = () => {
          box.removeChild(dragBar)
          document.removeEventListener('mousemove', mousemoveEvent)
          document.removeEventListener('mouseup', mouseupEvent)
          changeEvent(drag, movingTarget)
        }
        document.addEventListener('mouseup', mouseupEvent, false)
      }
    }

    return {
      id,
      list,
      mousedownEvent
    }
  }
})
</script>
<style lang="scss">
.pkm-drag-sort {
  position: relative;
  user-select: none;
  ul, li {
    @include reset();
  }
  .select {
    position: absolute;
    width: 100%;
    display: block;
    border: 1px rgb(var(--primary-6)) dashed;
    background-color: rgba(0,0,0, 0.1);
    cursor: pointer;
    color: #ffffff;
    box-sizing: border-box;
  }
}
</style>
