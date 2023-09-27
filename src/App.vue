<script setup lang="ts">
import { ref } from "vue"
import Canvas from "./components/Canvas.vue"
import Editor from "./components/Editor.vue"
import TextOutput from "./components/TextOutput.vue"
import ToolBar from "./components/ToolBar.vue"

const canvas = ref<Canvas | null>(null)
const editor = ref<Editor | null>(null)
const textOutput = ref<TextOutput | null>(null)

function setCode() {
  textOutput.value.setContent(editor.value.getCode())
}

import SplitPane from "./components/SplitPane.vue"
</script>

<template>
  <div id="app-main">
    <ToolBar/>
    <!-- prettier-ignore-attribute -->
    <SplitPane direction="horizontal" initial_fraction="0.5">
      <template v-slot:first>
        <!-- prettier-ignore-attribute -->
        <SplitPane direction="vertical" initial_fraction="0.8">
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
  </div>
</template>

<style scoped></style>