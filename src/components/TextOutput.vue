<script setup lang="ts">
import { onMounted } from "vue"

let currentBlock: HTMLDivElement | undefined = undefined

function formatTimePart(n: number) {
    return n.toString().padStart(2, "0")
}

function formatTime(time: Date) {
    const hour = formatTimePart(time.getHours())
    const minute = formatTimePart(time.getHours())
    const second = formatTimePart(time.getSeconds())
    return `${hour}:${minute}:${second}`
}

function runFinished(success: boolean) {
    if (currentBlock === undefined) return
    const now = new Date()
    const msg = success ? "finished" : "failed"
    currentBlock.innerHTML += `<hr class="run-separator" data-time="${msg} ${formatTime(
        now,
    )}"/>`
}

function appendPythonStdout(text: string) {
    currentBlock?.appendChild(document.createTextNode(text))
}

function appendPythonStderr(text: string) {
    currentBlock?.appendChild(document.createTextNode(text))
}

function appendPythonException(exception: string) {
    currentBlock?.appendChild(document.createTextNode(exception))
}

function createNewBlock() {
    currentBlock = document
        .getElementById("text-output")!
        .appendChild(document.createElement("div"))
}

onMounted(() => {
    createNewBlock()
})

defineExpose({
    appendPythonException,
    appendPythonStderr,
    appendPythonStdout,
    runFinished,
})
</script>

<template>
    <div id="text-output" class="text-output"></div>
</template>

<style lang="scss">
.text-output {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 1ex;
    border: none;
    background: var(--color-on-background0);
    color: var(--color-text1);
    overflow-x: hidden;
    overflow-y: scroll;
    word-break: break-all;
    white-space: pre-wrap;
}

hr.run-separator {
    border: none;
    border-top: 3px solid var(--color-on-background1);
    color: var(--color-on-background2);
    overflow: visible;
    margin: 10px 0;

    &:after {
        background: var(--color-on-background0);
        content: attr(data-time);
        padding: 0 3pt;
        position: relative;
        top: -1.5ex;
    }
}
</style>
