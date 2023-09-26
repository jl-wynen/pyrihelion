<script setup lang="ts">
import { ref } from "vue"
import Editor from "./components/Editor.vue"
import TextOutput from "./components/TextOutput.vue"

const editor = ref<Editor | null>(null)
const textOutput = ref<TextOutput | null>(null)

function setCode() {
  textOutput.value.setContent(editor.value.getCode())
}

import SplitPane from "./components/SplitPane.vue"
</script>

<template>
  <div id="app-main">
    <span class="toolbar"> <button @click="setCode">click!</button></span>
    <SplitPane direction="horizontal" initial_fraction="0.5">
      <template v-slot:first>
        <SplitPane direction="vertical" initial_fraction="0.8">
          <template v-slot:first>
            <Editor ref="editor" />
          </template>
          <template v-slot:second>
            <TextOutput ref="textOutput" />
          </template>
        </SplitPane>
      </template>
      <template v-slot:second> Canvas </template>
    </SplitPane>
  </div>
</template>

<style scoped></style>
