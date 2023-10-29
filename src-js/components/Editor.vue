<script setup lang="ts">
import { onMounted } from "vue"

import { python } from "@codemirror/lang-python"
import { oneDark } from "@codemirror/theme-one-dark"
import { EditorView, basicSetup } from "codemirror"
import { EditorState } from "@codemirror/state"

let view: EditorView | null = null

onMounted(() => {
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

defineExpose({
    getCode,
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
