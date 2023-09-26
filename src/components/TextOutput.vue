<script setup lang="ts">
import { ref } from "vue"

const content = ref<String>("")

function setContent(newContent: String) {
  content.value = newContent
  console.log("setting")
}

defineExpose({
  setContent,
})
</script>

<template>
  <textarea id="text-output" name="text-output" rows="15" readonly="true">
    {{ content }}
  </textarea>
</template>

<style scoped></style>
