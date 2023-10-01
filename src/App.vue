<script setup lang="ts">
import { onMounted, ref } from "vue"
import Canvas from "./components/Canvas.vue"
import Editor from "./components/Editor.vue"
import SplitPane from "./components/SplitPane.vue"
import TextOutput from "./components/TextOutput.vue"
import ToolBar from "./components/ToolBar.vue"
import { loadPyodide as loadPyodideOrig, PyodideInterface } from "pyodide"

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
    py.runPythonAsync(editor.value.getCode()).then(
        (result) => {
            console.log("Python says " + result)
        },
        // TODO app hangs on errors
        (reason) => {
            textOutput.value?.appendPythonStderr(reason)
        },
    )
}

function configurePyodide(py: PyodideInterface) {
    py.setStdout({
        batched: textOutput.value?.appendPythonStdout,
    })
    py.setStderr({
        batched: textOutput.value?.appendPythonStderr,
    })
}

async function loadPyodide(): Promise<PyodideInterface> {
    const promise = loadPyodideOrig({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full",
    })
    promise.then(configurePyodide)
    return promise
}

onMounted(() => {
    // TODO this blocks the app completely until pyodide is loaded
    loadPyodide().then(
        (pyodide: PyodideInterface) => {
            py = pyodide
            toolBar.value!.buttons.run.value?.activate()
            toolBar.value!.buttons.run.value?.enable()
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
    <ToolBar ref="toolBar" @runCode="runPython" />
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
