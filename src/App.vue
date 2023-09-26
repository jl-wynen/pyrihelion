<script setup lang="ts">
import { ref } from "vue"
// import Editor from './components/Editor.vue'
// import TextOutput from './components/TextOutput.vue'
//
// const editor = ref<Editor | null>(null)
// const textOutput = ref<TextOutput | null>(null)

// function setCode() {
//   textOutput.value.setContent(editor.value.getCode())
// }

import SplitPane from "./components/SplitPane.vue"
</script>

<template>
  <div>
    <SplitPane>
      <template v-slot:left> Left </template>
      <template v-slot:right> Right </template>
    </SplitPane>
  </div>

  <!--  <div id="app-main">-->
  <!--    <div class="app-column">-->
  <!--      <div class="editor">-->
  <!--        <Editor ref="editor"/>-->
  <!--      </div>-->
  <!--      <div class="text-output">-->
  <!--        <TextOutput ref="textOutput"/>-->
  <!--      </div>-->
  <!--      <button @click=setCo>click!</button>-->
  <!--    </div>-->
  <!--    <div class="app-column">-->
  <!--      <textarea id="graphic-output" rows="30">This will be the canvas</textarea>-->
  <!--    </div>-->
  <!--  </div>-->
</template>

<style scoped></style>
