<script setup lang="ts">
import { inject, onMounted, ref } from "vue"
import type { Ref } from "vue"
import Canvas from "./components/Canvas.vue"
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

function globalKeyboardEventHandler(event: KeyboardEvent) {
    if (event.shiftKey && event.key == "Enter") {
        runPython()
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

    editor.value?.setCode(`import gangleri_backend as g
import js
from pyodide.ffi import create_proxy, to_js

def to_js_object(x: dict):
    return to_js(x, dict_converter=js.Object.fromEntries, create_pyproxies=False,)

params = {"color": "#aa9900"}
g.create(
    0,
    js.Array.new(0, 0, 0),
    "box",
    js.Array.new(1, 1, 1),
    "basic",
    to_js_object(params),
)
g.move_to(0, js.Array.new(1, 0, 0))
# g.destroy(0)
`)

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
</template>

<style scoped></style>
