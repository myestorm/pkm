<template>
  <div class="toolbar-group">
    <div class="toolbar-group-btn">
      <slot name="button"></slot>
    </div>
    <div class="toolbar-group-list">
      <slot name="list"></slot>
    </div>
  </div>
</template>
<style lang="scss" scope>
.toolbar-group-btn {
  .toolbar-btn {
    border-radius: 4px 4px 0 0
  }
}
</style>
