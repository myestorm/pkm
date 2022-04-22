<template>
  <div class="pkm-drag-list" ref="dragList">
    <div class="pkm-drag-item" draggable="true" v-for="(item, index) in modelValue" :key="index"
      :data-index="index"
      @dragstart="dragstart($event, index)"
      @drag="drag($event, index)"
      @dragend="dragend($event, index)"

      @dragenter="dragenter($event, index)"
      @dragover.prevent="dragover($event, index)"
      @dragleave="dragleave($event, index)"
      @drop.prevent="drop($event, index)"
    >
      <slot :index="index" :item="item">
      </slot>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
export type DropPositionType = -1 | 0 | 1
export interface CalcDropPositionType {
  clientX: number,
  clientY: number,
  left: number,
  top: number,
  width: number,
  height: number,
  dragIndex: number,
  dropIndex: number,
  startClientX: number
}
export default defineComponent({
  props: {
    modelValue: {
      type: Array,
      default: []
    },
    calcDropPosition: {
      type: Function,
      default: (data: CalcDropPositionType): DropPositionType => {
        const { clientX, clientY, left, top, width, height, startClientX } = data
        const h = height / 4
        let dropPosition: DropPositionType = 0
        if (clientX - startClientX > 4) {
          dropPosition = 0
        } else {
          if (clientY < top + h) {
            dropPosition = -1
          } else if (clientY > top + (h * 3)) {
            dropPosition = 1
          } else {
            dropPosition = 0
          }
        }
        return dropPosition
      }
    }
  },
  emits: ['start', 'move', 'beforeEnd', 'end', 'update:modelValue'],
  setup (props, ctx) {
    const dragList = ref()
    const dragClass = 'drag'
    const dragzoneClass = 'dragzone-'
    const dragzoneClassList = [`${dragzoneClass}-1`, `${dragzoneClass}0`, `${dragzoneClass}1`]

    let startClientX: number = 0
    let dragIndex = -1
    let dragging: HTMLElement

    // 获取节点
    const getDragTarget = (target: HTMLElement): HTMLElement => {
      return target.closest('.pkm-drag-item') || target
    }

    // 计算位置
    const calcDropPosition = (event: DragEvent): DropPositionType => {
      let dropPosition: -1 | 0 | 1 = 0
      const _target = event.target as HTMLElement
      const target = getDragTarget(_target)
      const { clientX, clientY } = event
      const { left, top, width, height } = target.getBoundingClientRect()
      const dropIndex = Number(target.dataset.index)
      if (typeof props.calcDropPosition === 'function') {
        dropPosition = props.calcDropPosition({
          clientX,
          clientY,
          left,
          top,
          width,
          height,
          dragIndex,
          dropIndex,
          startClientX
        })
      }
      return dropPosition
    }

    // 数据排序
    const sortData = (from: number, to: number, position: DropPositionType) => {
      const _list = [...props.modelValue]
      const _from = _list[from]

      _list.splice(from, 1)
      to = from < to ? to - 1 : to

      if (position === -1) {
        const _to = to
        _to < 0 ?_list.unshift(_from) : _list.splice(_to, 0, _from)
      } else if (position === 1) {
        _list.splice(to + 1, 0, _from)
      }

      return _list
    }

    const dragstart = (event: DragEvent, index: number) => {
      const dataTransfer = event.dataTransfer as DataTransfer
      dataTransfer.dropEffect = 'move'
      dragging = event.target as HTMLElement
      dragging.classList.add(dragClass)
      startClientX = event.clientX
      dragIndex = index
      ctx.emit('start', index, props.modelValue[index])
    }
    const drag = (event: DragEvent, index: number) => {
    }
    const dragend = (event: DragEvent, index: number) => {
      dragging.classList.remove(dragClass)
    }

    // 进入对象
    const dragenter = (event: DragEvent, index: number) => {
      const _target = event.target as HTMLElement
      const target = getDragTarget(_target)
      const dropPosition = calcDropPosition(event)
      if (target !== dragging) {
        target.classList.add(dragzoneClass + dropPosition)
      }
    }
    const dragover = (event: DragEvent, index: number) => {
      const dropPosition = calcDropPosition(event)
      const _target = event.target as HTMLElement
      const target = getDragTarget(_target)
      if (target !== dragging) {
        target.classList.remove(...dragzoneClassList)
        target.classList.add(dragzoneClass + dropPosition)
        ctx.emit('move', dragIndex, props.modelValue[dragIndex], index, props.modelValue[index])
      }
    }
    const dragleave = (event: DragEvent, index: number) => {
      const _target = event.target as HTMLElement
      const target = getDragTarget(_target)
      if (target !== dragging) {
        target.classList.remove(...dragzoneClassList)
      }
    }
    const drop = (event: DragEvent, index: number) => {
      const _target = event.target as HTMLElement
      const target = getDragTarget(_target)
      const oldList = JSON.parse(JSON.stringify(props.modelValue))
      if (target !== dragging) {
        const dropPosition = calcDropPosition(event)
        target.classList.remove(...dragzoneClassList)
        ctx.emit('beforeEnd', dragIndex, index, dropPosition)
        const list = sortData(dragIndex, index, dropPosition)
        ctx.emit('update:modelValue', list)
        ctx.emit('end', { dragIndex, dropIndex: index, dropPosition, oldList, list })
      }
    }

    return {
      dragList,
    
      dragstart,
      drag,
      dragend,

      dragenter,
      dragover,
      dragleave,
      drop
    }
  }
})
</script>
<style lang="scss">
.#{$--prefix}-drag-list {
  width: 100%;
  .#{$--prefix}-drag-item {
    width: 100%;
    display: flex;
    cursor: pointer;
    align-items: stretch;
    position: relative;
    box-sizing: border-box;
    &::before, &::after {
      width: 100%;
      height: 4px;
      content: "";
      display: none;
      background-color: blueviolet;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 3;
    }
    &::after {
      top: auto;
      bottom: 0;
    }
  }
  .drag {
    cursor: move;
    border: 2px dotted rgb(var(--danger-6));
    opacity: 0.8;
  }
  .dragzone--1 {
    &::before {
      display: block;
    }
  }
  .dragzone-0 {
    background-color: transparentize($color: blueviolet, $amount: 0.9);
    .item, .item.current {
      background-color: transparentize($color: blueviolet, $amount: 0.9) !important;
    }
  }
  .dragzone-1 {
    &::after {
      display: block;
    }
  }
}
</style>
