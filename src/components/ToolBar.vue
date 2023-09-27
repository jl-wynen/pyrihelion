<script setup lang="ts">
import { ref } from "vue"
import ButtonRun from "./ButtonRun.vue"
import ButtonStop from "./ButtonStop.vue"

const buttonRun = ref<InstanceType<typeof ButtonRun> | null>(null)
const buttonStop = ref<InstanceType<typeof ButtonStop> | null>(null)

const buttons = {
    run: buttonRun,
    stop: buttonStop,
}

defineExpose({
    buttons,
})

defineEmits(["runCode", "stopRunning"])
</script>

<template>
    <span class="toolbar">
        <ButtonRun ref="buttonRun" @runCode="$emit('runCode')" />
        <ButtonStop ref="buttonStop" @stopRunning="$emit('stopRunning')" />
    </span>
</template>

<style scoped lang="scss">
.toolbar {
    box-sizing: border-box;
    padding: 2pt 1em 2pt 1em;
}

.toolbar button {
    border: none;
    border-radius: 0;
    height: 100%;
}
</style>
