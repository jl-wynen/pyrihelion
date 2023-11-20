<script setup lang="ts">
import { ref } from "vue"
import ConfirmDialog from "./ConfirmDialog.vue"

const button = ref<HTMLButtonElement | null>(null)
const confirmDialog = ref<InstanceType<typeof ConfirmDialog> | null>(null)

function requestReset() {
    if (confirmDialog.value === null) {
        return
    }
    confirmDialog.value.show()
}

function doReset() {
    confirmDialog.value!.hide()
    emit("resetCode")
}

function cancelReset() {
    confirmDialog.value!.hide()
}

const emit = defineEmits(["resetCode"])
</script>

<template>
    <button ref="button" class="reset-button" @click="requestReset">
        <font-awesome-icon icon="fa-solid fa-rotate-left" class="reset-icon" />
    </button>
    <ConfirmDialog
        ref="confirmDialog"
        @yes="doReset"
        @no="cancelReset"
        :positive="false"
    >
        Reset code?
    </ConfirmDialog>
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
