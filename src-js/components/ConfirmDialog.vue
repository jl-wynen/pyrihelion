<script setup lang="ts">
import { nextTick, ref } from "vue"
import WarnTriangle from "../assets/icons/warn-triangle.svg"

defineProps<{
    positive: boolean
}>()

const visible = ref(false)
const yesButton = ref<HTMLButtonElement | null>(null)

async function show() {
    visible.value = true
    await nextTick()
    yesButton.value?.focus()
}

function hide() {
    visible.value = false
}

defineExpose({ show, hide })

defineEmits(["yes", "no"])
</script>

<template>
    <div class="confirm-dialog-overlay modal-overlay" v-if="visible">
        <div
            class="confirm-dialog"
            :class="positive ? 'confirm-positive' : 'confirm-negative'"
        >
            <div>
                <WarnTriangle />
                <slot />
            </div>
            <div>
                <button
                    class="yes-button"
                    @click="$emit('yes')"
                    ref="yesButton"
                >
                    Yes
                </button>
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
    border: 4px solid var(--color-background1);

    padding: 1rem;
    max-width: 50%;

    font-size: 1.5rem;
}

.confirm-dialog > div {
    display: flex;
    align-items: center;
}

.confirm-dialog svg {
    height: 1.8rem;
    margin-left: 1rem;
    margin-right: 1rem;

    & > path {
        fill: var(--color-warn0) !important;
    }
}

.confirm-dialog button {
    font-size: 1.2rem;
    margin: 2rem 1rem 0 1rem;
    width: 8em;
}

.confirm-positive .yes-button {
    background-color: var(--color-success0);
}

.confirm-negative .yes-button {
    background-color: var(--color-error0);
}

.confirm-positive .no-button,
.confirm-negative .no-button {
    background-color: var(--color-warn0);
    //background-color: var(--color-on-background1);
}

.v-leave-active > .confirm-dialog {
    transition: all 0.1s ease-in;
}

.v-leave-to > .confirm-dialog {
    opacity: 0;
}
</style>
