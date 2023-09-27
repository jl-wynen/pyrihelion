<script setup lang="ts">
import { onMounted, ref } from "vue"

const button = ref<HTMLButtonElement | null>(null)

function enable() {
    button.value.disabled = false
}

onMounted(() => {
    button.value.disabled = true
})

defineExpose({
    enable,
})

defineEmits(["stopRunning"])
</script>

<template>
    <button ref="button" @click="$emit('stopRunning')">
        <font-awesome-icon icon="fa-solid fa-stop" />STOP
    </button>
</template>

<style lang="scss"></style>
