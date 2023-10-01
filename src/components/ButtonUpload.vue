<script setup lang="ts">
import { ref } from "vue"

const button = ref<HTMLButtonElement | null>(null)

defineEmits(["uploadCode"])
</script>

<template>
    <button ref="button" class="upload-button" @click="$emit('uploadCode')">
        <font-awesome-icon icon="fa-solid fa-upload" class="upload-icon" />
    </button>
</template>

<style lang="scss">
.upload-button {
    background-color: inherit;
    color: var(--color-text-on-color0);
    cursor: pointer;

    &:hover {
        background-color: var(--color-on-background1);
    }
}

.upload-icon {
    width: 1.5ex;
    height: 2ex;
}
</style>
