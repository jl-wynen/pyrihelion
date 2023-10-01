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

defineEmits(["stopRunning"])
</script>

<template>
    <button ref="button" class="stop-button" @click="$emit('stopRunning')">
        <font-awesome-icon icon="fa-solid fa-stop" class="stop-icon" />STOP
    </button>
</template>

<style lang="scss">
.stop-button {
    width: 4.5em !important;

    &:disabled {
        background-color: var(--color-on-background1);
        color: var(--color-text2);
        cursor: default;
    }

    &:enabled {
        background-color: var(--color-error0);
        color: var(--color-text-on-color0);
        cursor: pointer;

        &:hover {
            background-color: var(--color-error1);
        }
    }
}

.stop-icon {
    width: 1.5ex;
    height: 2ex;
    margin-left: 0.4ex;
    margin-right: 0.6ex;
}
</style>
