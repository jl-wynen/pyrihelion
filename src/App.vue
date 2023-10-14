<script setup lang="ts">
import { inject, onMounted, ref } from "vue"
import type { Ref } from "vue"
import Canvas from "./components/Canvas.vue"
import Editor from "./components/Editor.vue"
import SplitPane from "./components/SplitPane.vue"
import TextOutput from "./components/TextOutput.vue"
import ToolBar from "./components/ToolBar.vue"
import { Python, PythonStatus } from "./python"

import { pythonRunning } from "./injectionKeys"

const canvas = ref<InstanceType<typeof Canvas> | null>(null)
const editor = ref<InstanceType<typeof Editor> | null>(null)
const textOutput = ref<InstanceType<typeof TextOutput> | null>(null)
const toolBar = ref<InstanceType<typeof ToolBar> | null>(null)

let python: Python | undefined

function runPython() {
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
    toolBar.value?.buttons.run.value?.deactivate()
    python?.terminate()
}

function onPythonFinished({ success, error }: PythonStatus) {
    if (!success) {
        console.warn("Python failed: " + error)
    }
}

function onPythonLoaded({ success, error }: PythonStatus) {
    if (success) {
        toolBar.value!.buttons.run.value?.activate()
        console.log("Successfully loaded Pyodide")
    } else {
        console.error("Failed to load Pyodide: " + error)
    }
}

onMounted(() => {
    python = new Python(
        {
            stdout: textOutput.value!.appendPythonStdout,
            stderr: textOutput.value!.appendPythonStderr,
        },
        onPythonLoaded,
        onPythonFinished,
        {
            running: inject(pythonRunning) as Ref<boolean>,
        },
    )

    editor.value?.setCode(`def foo(x: int, y: int) -> int:
        return x + y


import time
time.sleep(1)
print(foo(1, 2))
`)
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
</template>

<style scoped></style>
