<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{
  text: string;
  color: string;
  size: string;
  disabled: boolean;
}>();
</script>

<template>
  <div class="button">
    <button @click="">{{ text }}</button>
  </div>
</template>

<style scoped>
.button {
  display: flex;
  color: bisque;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
</style>
