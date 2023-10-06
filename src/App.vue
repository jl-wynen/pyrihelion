<script setup lang="ts">
import { onMounted, ref } from "vue"
import Canvas from "./components/Canvas.vue"
import Editor from "./components/Editor.vue"
import SplitPane from "./components/SplitPane.vue"
import TextOutput from "./components/TextOutput.vue"
import ToolBar from "./components/ToolBar.vue"
import type { PyodideInterface } from "pyodide"
import { loadPython } from "./python"

const canvas = ref<InstanceType<typeof Canvas> | null>(null)
const editor = ref<InstanceType<typeof Editor> | null>(null)
const textOutput = ref<InstanceType<typeof TextOutput> | null>(null)
const toolBar = ref<InstanceType<typeof ToolBar> | null>(null)

let py: PyodideInterface | null = null

function runPython() {
    if (py === null) {
        console.error("Cannot run Python, Pyodide is not loaded.")
        return
    }
    if (editor.value === null) {
        console.error("Cannot run Python, cannot access the editor.")
        return
    }
    toolBar.value?.buttons.stop.value?.enable()
    toolBar.value?.buttons.run.value?.setRunning(true)
    py.runPythonAsync(editor.value.getCode()).then(
        (result) => {
            console.log("Python says " + result)
            finishRunning()
        },
        // TODO app hangs on errors
        (reason) => {
            textOutput.value?.appendPythonStderr(reason)
        },
    )
}

function finishRunning() {
    toolBar.value?.buttons.stop.value?.disable()
    toolBar.value?.buttons.run.value?.setRunning(false)
}

function rerunPython() {}

onMounted(() => {
    // TODO this blocks the app completely until pyodide is loaded
    loadPython({
        stdout: textOutput.value!.appendPythonStdout,
        stderr: textOutput.value!.appendPythonStderr,
    }).then(
        (pyodide: PyodideInterface) => {
            py = pyodide
            toolBar.value!.buttons.run.value?.activate()
            console.log("Successfully loaded Pyodide")
        },
        (reason) => {
            console.error("Failed to load Pyodide: " + reason)
        },
    )

    editor.value?.setCode(`def foo(x: int, y: int) -> int:
    return x + y


print(foo(1, 2))
`)
})
</script>

<template>
    <ToolBar ref="toolBar" @rerunCode="rerunPython" @runCode="runPython" />
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
