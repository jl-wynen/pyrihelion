<script setup lang="ts">
import {ref} from "vue";

let splitpane = ref();

let sizes = ref({
  first: "50%",
  second: "50%",
})

let touch = {
  mouseDown: false,
  dragging: false,
}

function bindMouseDragEvents() {
  document.addEventListener('mousemove', onMouseMove, {passive: false})
  document.addEventListener('mouseup', onMouseUp)
}

function unbindMouseDragEvents() {
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
}

function onMouseDown(event: MouseEvent) {
  if (event.button == 0) {  // left button
    bindMouseDragEvents()
    touch.mouseDown = true
  }
}

function onMouseUp() {
  unbindMouseDragEvents()
  touch.mouseDown = false
  touch.dragging = false
}

function onMouseMove(event: MouseEvent) {
  if (touch.mouseDown) {
    event.preventDefault()
    touch.dragging = true
    calculatePaneSizes(event)
  }
}

function calculatePaneSizes(event: MouseEvent) {
  const rect = splitpane.value.getBoundingClientRect()
  const fraction = (event.clientX - rect.left) / rect.width
  sizes.value.first = fraction * 100 + '%'
  sizes.value.second = 100 - fraction * 100 + '%'
}
</script>

<template>
  <div ref="splitpane" class="splitpane">
    <div ref="pane_left" class="pane pane-left" >
      <slot name="left"></slot>
    </div>
    <div class="pane-splitter" @mousedown="onMouseDown"></div>
    <div ref="pane_right" class="pane pane-right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
$splitter-width: 1ex;

.splitpane {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  justify-content: space-between;
}

.pane-left {
  width: calc(v-bind('sizes.first') - $splitter-width / 2);
  background: #c54949;
}

.pane-right {
  width: calc(v-bind('sizes.second') - $splitter-width / 2);
  background: #3f3fb9;
}

.pane-splitter {
  width: $splitter-width;
  min-width: $splitter-width;
  height: 100%;
  cursor: col-resize;
  background: #4ea24e;
}
</style>