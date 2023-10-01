<script setup lang="ts">
import { onMounted, ref } from "vue"

const button = ref<HTMLButtonElement | null>(null)

let active = ref(false)

function activate() {
    if (button.value === null) return
    active.value = true
}

function enable() {
    if (button.value !== null) button.value.disabled = false
}

onMounted(() => {
    button.value!.disabled = true
})

defineExpose({
    activate,
    enable,
})

defineEmits(["runCode"])
</script>

<template>
    <button ref="button" class="run-button" @click="$emit('runCode')">
        <div>
            <font-awesome-icon
                v-if="active"
                icon="fa-solid fa-play"
                class="run-icon"
            />
            <div v-else class="run-spinner"></div>
            <div>RUN</div>
        </div>
    </button>
</template>

<style lang="scss">
.run-button:enabled {
    background-color: var(--color-success);
    color: var(--color-text0);
}

.run-button > div {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.run-icon {
    display: inline-block;
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

        // Centre the :after element in the parent.
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        margin: auto calc(100% - 10px);

        border-radius: 50%;
        border: 3px solid;
        border-color: #337eab transparent #337eab transparent;
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
