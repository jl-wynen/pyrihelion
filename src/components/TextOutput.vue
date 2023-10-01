<script setup lang="ts">
import { ref } from "vue"

const content = ref<string>("")

function setContent(newContent: string) {
    content.value = newContent
}

defineExpose({
    setContent,
})
</script>

<template>
    <textarea class="text-output" rows="15" :readonly="true">{{
        content
    }}</textarea>
</template>

<style lang="scss">
.text-output {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    resize: none;
    margin: 0;
    padding: 1ex;
    border: none;
    background: #282c34;
    color: #c4c4c4;

    &:focus-visible {
        outline: none;
    }
}
</style>
