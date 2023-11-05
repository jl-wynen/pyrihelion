<script setup lang="ts">
import { inject, Ref } from "vue"
import { updateRate as updateRateKey } from "../injection"
import { UpdateRate, toggleAxesHelper } from "../gangleri"

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
        <div id="canvas-toolbar">
            <input
                type="checkbox"
                id="toggle-axes"
                @change="toggleAxesHelper"
            />
            <label for="toggle-axes">x</label>
        </div>
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
    right: 5em;
    padding: 1ex;
    text-align: left;
    z-index: 100;
    display: block;
    color: white;
    user-select: none;
}

#canvas-toolbar {
    position: absolute;
    top: 0;
    right: 0;
    padding: 1ex;
    z-index: 100;
    display: block;
    color: white;
    user-select: none;
}

#canvas-toolbar input[type="checkbox"] {
    height: 0;
    width: 0;
    visibility: hidden;
    display: none;
}

#canvas-toolbar label {
    display: table-cell;
    width: 2em;
    height: 2em;
    background: #3232327f;
    border: 1px solid #7070707f;
    border-radius: 5px;
    cursor: pointer;
    text-align: center;
    vertical-align: middle;

    &:hover {
        background: #4d4d4d9f;
    }

    &:active {
        background: #6060609f;
    }
}

#canvas-toolbar input[type="checkbox"]:checked + label {
    background: #6060609f;

    &:hover {
        background: #4d4d4d9f;
    }

    &:active {
        background: #3232327f;
    }
}

#canvas-toolbar button {
    background: #3232327f;
    border: 1px solid #7070707f;
    border-radius: 5px;
    width: 2em;
    height: 2em;

    &:hover {
        background: #4d4d4d9f;
    }

    &:active {
        background: #6060609f;
    }
}
</style>
