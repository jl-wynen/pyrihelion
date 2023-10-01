<script setup lang="ts">
import { onMounted, ref } from "vue"

const button = ref<HTMLButtonElement | null>(null)

function enable() {
    if (button.value !== null) button.value.disabled = false
}

onMounted(() => {
    button.value!.disabled = true
})

defineExpose({
    enable,
})

defineEmits(["runCode"])
</script>

<template>
    <button ref="button" @click="$emit('runCode')">
        <font-awesome-icon icon="fa-solid fa-play" />RUN
    </button>
</template>

<style lang="scss"></style>
