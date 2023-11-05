<script setup lang="ts">
import { onMounted } from "vue"

import { python } from "@codemirror/lang-python"
import { oneDark } from "@codemirror/theme-one-dark"
import { EditorView, basicSetup } from "codemirror"
import { EditorState } from "@codemirror/state"

import { accessDatabase } from "../database"
import { preferences } from "../preferences"

let view: EditorView | null = null

const codeLoader = {
    op: (store: IDBObjectStore) => {
        const request = store.get("userCode")
        request.onsuccess = () => {
            setCode(request.result?.code ?? "default code")
        }
    },
    onerror: () => {
        console.error("Failed to get code")
        setCode("default code")
    },
}

const codeSaver = {
    op: (store: IDBObjectStore) => {
        store.put({ id: "userCode", code: getCode() })
    },
    onerror: () => {
        console.error("Failed to save code")
    },
}

onMounted(() => {
    accessDatabase(codeLoader, "code", "readonly")

    let state = EditorState.create({
        extensions: [basicSetup, python(), oneDark],
    })

    view = new EditorView({
        state: state,
        parent: document.getElementById("editor")!,
    })
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

function saveCode() {
    if (preferences.value.cookies === true) {
        accessDatabase(codeSaver, "code", "readwrite")
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
