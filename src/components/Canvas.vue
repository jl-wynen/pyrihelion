<script setup lang="ts">
import { inject, Ref } from "vue"
import { updateRate as updateRateKey } from "../injection"
import { UpdateRate } from "../gangleri"

const updateRate = inject(updateRateKey) as Ref<UpdateRate>

function getRenderContainer(): HTMLElement {
    return document.getElementById("render-container")!
}

defineExpose({
    getRenderContainer,
})
</script>

<template>
    <div id="canvas-wrapper">
        <div id="render-container"></div>
        <div id="update-rate">fps: {{ updateRate.fps }}</div>
    </div>
</template>

<style lang="scss">
#canvas-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
}

#render-container {
    width: 100%;
    height: 100%;
    background: black;
}

#update-rate {
    position: absolute;
    top: 0;
    right: 0;
    padding: 1ex;
    text-align: left;
    z-index: 100;
    display: block;
    color: white;
    user-select: none;
}
</style>
