<script setup lang="ts">
import { ref } from "vue"

const content = ref<string>("")

function appendPythonStdout(text: string) {
    content.value += text + "\n"
}

function appendPythonStderr(text: string) {
    content.value += "Err:" + text + "\n"
}

function appendPythonException(exception: string) {
    content.value += "Exception:" + exception + "\n"
}

defineExpose({
    appendPythonException,
    appendPythonStderr,
    appendPythonStdout,
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
    background: var(--color-on-background0);
    color: #c4c4c4;

    &:focus-visible {
        outline: none;
    }
}
</style>
