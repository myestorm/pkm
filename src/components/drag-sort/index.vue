<template>
  <div class="pkm-drag-list" ref="dragList">
    <transition-group name="flip-list">
      <div class="pkm-drag-item" draggable="true" v-for="(item, index) in list" :key="index"
        @dragstart="dragstart($event, index)"
        @drag="drag($event, index)"
        @dragend="dragend($event, index)"

        @dragenter="dragenter($event, index)"
        @dragover.prevent="dragover($event, index)"
        @dragleave="dragleave($event, index)"
        @drop.prevent="drop($event, index)"
      >
        <a draggable="false" href="#">{{item}} --- {{ index }}</a>
        <img draggable="false" src="../../assets/logo/logo.png">
      </div>
    </transition-group>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import gsap from 'gsap'
export default defineComponent({
  setup () {
    const list = ref(['a', 'b', 'c', 'e', 'f'])
    const dragList = ref()
    const dragClass = 'drag'
    const dragzoneClass = 'dragzone-'
    const dragzoneClassList = [`${dragzoneClass}-1`, `${dragzoneClass}0`, `${dragzoneClass}1`]

    let startClientX: number = 0
    let dargIndex = -1

    // 计算位置
    const calcDropPosition = (event: DragEvent): -1 | 0 | 1 => {
      let dropPosition: -1 | 0 | 1 = 0
      const target = event.target as HTMLElement
      const { clientX, clientY } = event
      const { left, top, width, height } = target.getBoundingClientRect()
      const h = height / 4
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

    // 交换数据
    const makeData = (form: number, to: number, position: -1 | 0 | 1) => {
      const _list = [...list.value]
      const _from = _list[form]

      _list.splice(form, 1)
      to = form < to ? to - 1 : to

      if (position === -1) {
        const _to = to
        _to < 0 ?_list.unshift(_from) : _list.splice(_to, 0, _from)
      } else if (position === 1) {
        _list.splice(to + 1, 0, _from)
      }
      list.value = [..._list]
    }

    

    // 拖拽对象
    let dragging: HTMLElement

    const dragstart = (event: DragEvent, index: number) => {
      dragging = event.target as HTMLElement
      dragging.classList.add(dragClass)
      startClientX = event.clientX
      dargIndex = index
    }
    const drag = (event: DragEvent, index: number) => {
    }
    const dragend = (event: DragEvent, index: number) => {
      dragging.classList.remove(dragClass)
    }

    // 进入对象
    const dragenter = (event: DragEvent, index: number) => {
      const target = event.target as HTMLElement
      const dropPosition = calcDropPosition(event)
      if (target !== dragging) {
        target.classList.add(dragzoneClass + dropPosition)
      }
    }
    const dragover = (event: DragEvent, index: number) => {
      const dropPosition = calcDropPosition(event)
      const target = event.target as HTMLElement
      if (target !== dragging) {
        target.classList.remove(...dragzoneClassList)
        target.classList.add(dragzoneClass + dropPosition)
      }
    }
    const dragleave = (event: DragEvent, index: number) => {
      const target = event.target as HTMLElement
      if (target !== dragging) {
        target.classList.remove(...dragzoneClassList)
      }
    }
    const drop = (event: DragEvent, index: number) => {
      const target = event.target as HTMLElement
      if (target !== dragging) {
        const dropPosition = calcDropPosition(event)
        target.classList.remove(...dragzoneClassList)
        makeData(dargIndex, index, dropPosition)
      }
    }


    const init = () => {
      
    }
    onMounted(init)

    return {
      dragList,
    
      dragstart,
      drag,
      dragend,

      dragenter,
      dragover,
      dragleave,
      drop,

      list
    }
  }
})
</script>
<style lang="scss" scoped>
.pkm-drag-list {
  position: relative;
  .pkm-drag-item {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    border: 2px #ddd solid;
    justify-content: left;
    box-sizing: border-box;
    background-color: #f5f5f5;
    img {
      width: 60px;
    }
  }
  .drag {
    border: 2px dotted red;
    cursor: move;
    opacity: 0.6;
  }
  .dragzone--1 {
    border-color: transparent;
    border-top-color: blue;
  }
  .dragzone-0 {
    border-color: blue;
    background-color: blueviolet;
  }
  .dragzone-1 {
    border-color: transparent;
    border-bottom-color: blue;
  }
  .flip-list-move {
    transition: transform 0.8s ease;
  }
}
</style>
