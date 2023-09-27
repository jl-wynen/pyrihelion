<script setup lang="ts">
import { onMounted, ref } from "vue"
import Canvas from "./components/Canvas.vue"
import Editor from "./components/Editor.vue"
import SplitPane from "./components/SplitPane.vue"
import TextOutput from "./components/TextOutput.vue"
import ToolBar from "./components/ToolBar.vue"

const canvas = ref<InstanceType<typeof Canvas> | null>(null)
const editor = ref<InstanceType<typeof Editor> | null>(null)
const textOutput = ref<InstanceType<typeof TextOutput> | null>(null)
const toolBar = ref<InstanceType<typeof ToolBar> | null>(null)

function setCode() {
    textOutput.value.setContent(editor.value.getCode())
}

onMounted(() => {
    toolBar.value.buttons.run.value.enable()
})
</script>

<template>
    <!--    <div id="app-main">-->
    <ToolBar ref="toolBar" @runCode="setCode" />
    <!-- prettier-ignore-attribute -->
    <SplitPane direction="horizontal" initial_fraction=0.5>
        <template v-slot:first>
            <!-- prettier-ignore-attribute -->
            <SplitPane direction="vertical" initial_fraction=0.8>
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
    <!--    </div>-->
</template>

<style scoped></style>
