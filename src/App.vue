<script setup lang="ts">
import GameField from './components/GameField.vue'
</script>

<template>
  <div class="flex flex-col items-center h-[100vh] bg-black">
    <GameField class="flex-grow"></GameField>
    <h1 class="relative flex items-center justify-center py-2 min-h-max text-white text-3xl text-center">The Gravitron</h1>
  </div>
</template>

<style scoped>
</style>
