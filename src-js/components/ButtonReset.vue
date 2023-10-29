<script setup lang="ts">
import { ref } from "vue"

const button = ref<HTMLButtonElement | null>(null)

defineEmits(["resetCode"])
</script>

<template>
    <button ref="button" class="reset-button" @click="$emit('resetCode')">
        <font-awesome-icon icon="fa-solid fa-rotate-left" class="reset-icon" />
    </button>
</template>

<style lang="scss">
.reset-button {
    background-color: inherit;
    color: var(--color-text-on-color0);
    cursor: pointer;

    &:hover {
        background-color: var(--color-on-background1);
    }
}

.reset-icon {
    width: 1.5ex;
    height: 2ex;
}
</style>
