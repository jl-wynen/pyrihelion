<script setup lang="ts">
import { ref } from "vue"
import ButtonDownload from "./ButtonDownload.vue"
import ButtonReset from "./ButtonReset.vue"
import ButtonRun from "./ButtonRun.vue"
import ButtonStop from "./ButtonStop.vue"
import ButtonUpload from "./ButtonUpload.vue"

const buttonDownload = ref<InstanceType<typeof ButtonDownload> | null>(null)
const buttonReset = ref<InstanceType<typeof ButtonReset> | null>(null)
const buttonRun = ref<InstanceType<typeof ButtonRun> | null>(null)
const buttonStop = ref<InstanceType<typeof ButtonStop> | null>(null)
const buttonUpload = ref<InstanceType<typeof ButtonUpload> | null>(null)

const buttons = {
    download: buttonDownload,
    reset: buttonReset,
    run: buttonRun,
    stop: buttonStop,
    upload: buttonUpload,
}

defineExpose({
    buttons,
})

defineEmits([
    "downloadCode",
    "resetCode",
    "runCode",
    "stopRunning",
    "uploadCode",
])
</script>

<template>
    <span class="toolbar">
        <ButtonDownload ref="buttonDownload" @runCode="$emit('downloadCode')" />
        <ButtonUpload ref="buttonUpload" @runCode="$emit('uploadCode')" />
        <ButtonReset ref="buttonReset" @runCode="$emit('uploadReset')" />
        <ButtonRun ref="buttonRun" @runCode="$emit('runCode')" />
        <ButtonStop ref="buttonStop" @stopRunning="$emit('stopRunning')" />
    </span>
</template>

<style scoped lang="scss"></style>
