<script setup lang="ts">
import { ref } from "vue"

const visible = ref(false)

function show() {
    visible.value = true
}

function hide() {
    visible.value = false
}

defineExpose({ show, hide })

defineEmits(["yes", "no"])
</script>

<template>
    <div class="confirm-dialog-overlay modal-overlay" v-if="visible">
        <div class="confirm-dialog">
            <slot />
            <div>
                <button class="yes-button" @click="$emit('yes')">Yes</button>
                <button class="no-button" @click="$emit('no')">No</button>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.confirm-dialog-overlay {
    display: flex;
    align-items: center;
    justify-content: center;
}

.confirm-dialog {
    background-color: var(--color-background0);
    color: var(--color-text0);

    padding: 1rem;
    max-width: 50%;
}

.confirm-dialog button {
    font-size: 1.2rem;
    margin-right: 1em;
    width: 8em;
}

.v-leave-active > .confirm-dialog {
    transition: all 0.1s ease-in;
}

.v-leave-to > .confirm-dialog {
    opacity: 0;
}
</style>
