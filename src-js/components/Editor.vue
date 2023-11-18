<script setup lang="ts">
import { onMounted } from "vue"

import { python } from "@codemirror/lang-python"
import { oneDark } from "@codemirror/theme-one-dark"
import { EditorView, basicSetup } from "codemirror"
import { EditorState } from "@codemirror/state"

import { loadFromDatabase, saveToDatabase } from "../database"
import { preferences } from "../preferences"

let view: EditorView | null = null

async function defaultCode(): Promise<string> {
    const request = await fetch(
        new URL("../../src-py/default-code/default.py", import.meta.url),
    )
    if (request.ok) return request.text()
    return "# Failed to load default code\n"
}

async function loadInitialCode(): Promise<string> {
    return await loadFromDatabase("code", "userCode").then(
        (object) => {
            return object.code
        },
        () => {
            return defaultCode()
        },
    )
}

onMounted(async () => {
    let state = EditorState.create({
        extensions: [basicSetup, python(), oneDark],
    })
    view = new EditorView({
        state: state,
        parent: document.getElementById("editor")!,
    })

    setCode(await loadInitialCode())
})

function getCode(): string {
    return view?.state.doc.toString() ?? ""
}

function setCode(code: string) {
    if (view === null) return
    view.dispatch(
        view.state.update({
            changes: { from: 0, to: view.state.doc.length, insert: code },
        }),
    )
}

async function saveCode() {
    if (preferences.value.cookies === true) {
        await saveToDatabase("code", { id: "userCode", code: getCode() })
    }
}

defineExpose({
    getCode,
    saveCode,
    setCode,
})
</script>

<template>
    <div id="editor"></div>
</template>

<style lang="scss">
#editor {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
}

.cm-editor {
    height: 100%;
    background-color: var(--color-on-background0);
}

.cm-gutter {
    background-color: var(--color-on-background0);
}

.cm-scroller {
    overflow: auto;
}

.ͼ1.cm-focused {
    outline: none;
}
</style>
