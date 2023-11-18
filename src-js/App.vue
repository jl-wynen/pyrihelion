<script setup lang="ts">
import { inject, onMounted, ref } from "vue"
import type { Ref } from "vue"
import Canvas from "./components/Canvas.vue"
import CookieBanner from "./components/CookieBanner.vue"
import Editor from "./components/Editor.vue"
import SplitPane from "./components/SplitPane.vue"
import TextOutput from "./components/TextOutput.vue"
import ToolBar from "./components/ToolBar.vue"

import * as gangleri from "./gangleri"
import { Python, PythonState, PythonStatus } from "./python"
import { pythonState, updateRate } from "./injection"

const canvas = ref<InstanceType<typeof Canvas> | null>(null)
const editor = ref<InstanceType<typeof Editor> | null>(null)
const textOutput = ref<InstanceType<typeof TextOutput> | null>(null)
const toolBar = ref<InstanceType<typeof ToolBar> | null>(null)

let python: Python | undefined

async function runPython() {
    await editor.value?.saveCode()
    if (python === undefined) {
        console.error("Cannot run Python, Pyodide is not loaded.")
        return
    }
    if (editor.value === null) {
        console.error("Cannot run Python, cannot access the editor.")
        return
    }
    python.run(editor.value!.getCode())
}

function stopPython() {
    if (python?.state === PythonState.Running) {
        python?.terminate()
    }
}

function onPythonFinished({ success, error }: PythonStatus) {
    if (!success) {
        textOutput.value?.appendPythonException(error!)
    }
    textOutput.value?.runFinished(success)
}

function onPythonLoaded({ success, error }: PythonStatus) {
    if (success) {
        console.log("Successfully loaded Pyodide")
    } else {
        console.error("Failed to load Pyodide: " + error)
    }
}

async function globalKeyboardEventHandler(event: KeyboardEvent) {
    if (event.shiftKey && event.key == "Enter") {
        await runPython()
        event.stopPropagation()
        event.preventDefault()
    } else if (event.key == "Escape") {
        stopPython()
        event.stopPropagation()
        event.preventDefault()
    }
}

onMounted(() => {
    document.addEventListener("keydown", globalKeyboardEventHandler)

    python = new Python(
        {
            stdout: textOutput.value!.appendPythonStdout,
            stderr: textOutput.value!.appendPythonStderr,
        },
        onPythonLoaded,
        onPythonFinished,
        inject(pythonState) as Ref<PythonState>,
    )

    gangleri.init({
        renderElement: canvas.value!.getRenderContainer(),
        updateRate: inject(updateRate) as Ref<gangleri.UpdateRate>,
    })
    gangleri.start()
})
</script>

<template>
    <ToolBar ref="toolBar" @runCode="runPython" @stopRunning="stopPython" />
    <SplitPane direction="horizontal" :initial_fraction="0.5">
        <template v-slot:first>
            <SplitPane direction="vertical" :initial_fraction="0.8">
                <template v-slot:first>
                    <Editor ref="editor" />
                </template>
                <template v-slot:second>
                    <TextOutput ref="textOutput" />
                </template>
            </SplitPane>
        </template>
        <template v-slot:second>
            <Canvas ref="canvas" />
        </template>
    </SplitPane>
    <CookieBanner />
</template>

<style scoped></style>
