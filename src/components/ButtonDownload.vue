<script setup lang="ts">
import { ref } from "vue"

const button = ref<HTMLButtonElement | null>(null)

defineEmits(["downloadCode"])
</script>

<template>
    <button ref="button" class="download-button" @click="$emit('downloadCode')">
        <font-awesome-icon icon="fa-solid fa-download" class="download-icon" />
    </button>
</template>

<style lang="scss">
.download-button {
    background-color: inherit;
    color: var(--color-text-on-color0);
    cursor: pointer;

    &:hover {
        background-color: var(--color-on-background1);
    }
}

.download-icon {
    width: 1.5ex;
    height: 2ex;
}
</style>
