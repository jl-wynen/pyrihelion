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
    <SplitPane direction="horizontal">
      <template v-slot:first>
        <SplitPane direction="vertical">
          <template v-slot:first>
            <button @click="setCode">click!</button>
            <div class="editor">
              <Editor ref="editor" />
            </div>
          </template>
          <template v-slot:second>
            <div class="text-output">
              <TextOutput ref="textOutput" />
            </div>
          </template>
        </SplitPane>
      </template>
      <template v-slot:second> Canvas </template>
    </SplitPane>
  </div>
</template>

<style scoped></style>
