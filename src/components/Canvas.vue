<script setup lang="ts">
function getRenderContainer(): HTMLElement {
    return document.getElementById("render-container")!
}

defineExpose({
    getRenderContainer,
})
</script>

<template>
    <div id="render-container"></div>
</template>

<style lang="scss">
#render-container {
    width: 100%;
    height: 100%;
    background: black;
}
</style>
