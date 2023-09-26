<script setup lang="ts">
import { ref } from "vue"

const content = ref<string>("")

function setContent(newContent: string) {
  content.value = newContent
}

defineExpose({
  setContent,
})
</script>

<template>
  <!-- prettier-ignore-attribute -->
  <textarea id="text-output" name="text-output" rows="15" readonly=true>{{
    content
  }}</textarea>
</template>

<style lang="scss">
$padding: 1ex;

#text-output {
  width: calc(100% - $padding);
  height: 100%;
  resize: none;
  margin: 0;
  padding: $padding;
  border: none;
  background: #282c34;
  color: #c4c4c4;
}
</style>
