<script setup lang="ts">
import { ref } from "vue"

const props = defineProps<{
    direction: "horizontal" | "vertical"
    initial_fraction: number
}>()

let splitpane = ref()

let sizes = ref({
    first: props.initial_fraction * 100 + "%",
    second: 100 - props.initial_fraction * 100 + "%",
})

let touch = {
    mouseDown: false,
    dragging: false,
}

function bindMouseDragEvents() {
    document.addEventListener("mousemove", onMouseMove, { passive: false })
    document.addEventListener("mouseup", onMouseUp)
}

function unbindMouseDragEvents() {
    document.removeEventListener("mousemove", onMouseMove)
    document.removeEventListener("mouseup", onMouseUp)
}

function onMouseDown(event: MouseEvent) {
    if (event.button == 0) {
        // left button
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
    let fraction =
        props.direction == "horizontal"
            ? (event.x - rect.left) / rect.width
            : (event.y - rect.top) / rect.height
    fraction = Math.max(Math.min(fraction, 0.95), 0.05)
    sizes.value.first = fraction * 100 + "%"
    sizes.value.second = 100 - fraction * 100 + "%"
}
</script>

<template>
    <div
        ref="splitpane"
        class="splitpane"
        :class="'splitpane-' + props.direction"
    >
        <div ref="pane_left" class="pane pane-first">
            <slot name="first"></slot>
        </div>
        <div
            class="pane-splitter"
            :class="'pane-splitter-' + props.direction"
            @mousedown="onMouseDown"
        ></div>
        <div ref="pane_right" class="pane pane-second">
            <slot name="second"></slot>
        </div>
    </div>
</template>

<style lang="scss">
$splitter-thickness: 1ex;

.splitpane {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;

    &-horizontal {
        flex-direction: row;
    }

    &-vertical {
        flex-direction: column;
    }
}

.splitpane-horizontal {
    & > .pane-first {
        width: calc(v-bind("sizes.first") - $splitter-thickness / 2);
    }

    & > .pane-second {
        width: calc(v-bind("sizes.second") - $splitter-thickness / 2);
    }
}

.splitpane-vertical {
    & > .pane-first {
        height: calc(v-bind("sizes.first") - $splitter-thickness / 2);
    }

    & > .pane-second {
        height: calc(v-bind("sizes.second") - $splitter-thickness / 2);
    }
}

.pane-splitter {
    background: var(--color-background);

    &-horizontal {
        width: $splitter-thickness;
        min-width: $splitter-thickness;
        height: 100%;
        cursor: col-resize;
    }

    &-vertical {
        height: $splitter-thickness;
        min-height: $splitter-thickness;
        width: 100%;
        cursor: row-resize;
    }
}
</style>
