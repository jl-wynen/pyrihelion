<script setup lang="ts">
import { onMounted, ref } from "vue"

const button = ref<HTMLButtonElement | null>(null)

let loading = ref(true)
let running = ref(false)

function activate() {
    if (button.value === null) return
    loading.value = false
    button.value.disabled = false
}

function deactivate() {
    if (button.value === null) return
    loading.value = true
    button.value.disabled = true
}

function setRunning(r: boolean) {
    if (running.value === null) return
    running.value = r
}

onMounted(() => {
    button.value!.disabled = true
})

defineExpose({
    activate,
    deactivate,
    setRunning,
})

defineEmits(["runCode"])
</script>

<template>
    <button ref="button" class="run-button" @click="$emit('runCode')">
        <div>
            <div v-if="loading" class="run-spinner"></div>
            <font-awesome-icon
                v-else-if="running"
                icon="fa-solid fa-rotate"
                class="run-icon"
            />
            <font-awesome-icon
                v-else
                icon="fa-solid fa-play"
                class="run-icon"
            />
            <div>RUN</div>
        </div>
    </button>
</template>

<style lang="scss">
.run-button {
    width: 4.5em !important;

    &:enabled {
        background-color: var(--color-success0);
        color: var(--color-text-on-color0);
        cursor: pointer;

        &:hover {
            background-color: var(--color-success1);
        }

        &:active {
            background-color: var(--color-success1) !important;
        }
    }

    &:disabled {
        background-color: var(--color-on-background1);
        color: var(--color-text2);
        cursor: default;
    }

    & > div {
        display: flex;
        flex-direction: row;
        align-items: center;
    }
}

.run-icon {
    width: 1.5ex;
    height: 2ex;
    margin-left: 0.6ex;
    margin-right: 0.6ex;
}

.run-spinner {
    position: relative;
    display: inline-block;
    width: 1.5ex;
    height: 1.5ex;
    margin-right: 1.2ex;

    &:after {
        content: " ";
        display: block;
        width: 1.5ex;
        height: 1.5ex;

        // Center the :after element in the parent.
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        margin: auto calc(100% - 10px);

        border-radius: 50%;
        border: 3px solid;
        border-color: var(--color-text-info) transparent var(--color-text-info)
            transparent;
        animation: run-spinner 1.2s linear infinite;
    }
}

@keyframes run-spinner {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
