<script setup lang="ts">
import { inject, Ref } from "vue"
import { updateRate as updateRateKey } from "../injection"
import { UpdateRate, toggleAxesHelper } from "../gangleri"

import AxesIcon from "../assets/icons/axes.svg"

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
            <label for="toggle-axes">
                <AxesIcon />
            </label>
            <input type="button" id="test-btn" />
            <label for="test-btn"><span>b</span></label>
        </div>
    </div>
</template>

<style lang="scss">
$button-size: 1.8rem;
$button-padding: 0.3rem;

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
    right: $button-size;
    padding: 0.5rem 1.5rem 0.5rem 0.5rem;
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
    padding: 0.5rem;
    z-index: 100;
    color: white;
    user-select: none;
    display: flex;
    flex-direction: column;
}

#canvas-toolbar input {
    height: 0;
    width: 0;
    visibility: hidden;
    display: none;
}

#canvas-toolbar label {
    display: flex;
    align-items: center;
    text-align: center;
    box-sizing: border-box;
    padding: $button-padding;
    width: $button-size;
    height: $button-size;
    background: #3232327f;
    border: 1px solid #7070707f;
    border-radius: 5px;
    cursor: pointer;

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

#canvas-toolbar label img,
#canvas-toolbar label span {
    max-width: $button-size - 2 * $button-padding;
    max-height: $button-size - 2 * $button-padding;
    margin: 0 auto;
}
</style>
