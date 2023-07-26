<script setup lang="ts">
import { ref } from 'vue'
import GameField from './components/GameField.vue'
import TheMenu from './components/TheMenu.vue'
const playerCount = ref<number>(1)
const gameRunning = ref(false)
const startGame = (value) => {
  playerCount.value = value
  gameRunning.value = true
}
</script>

<template>
  <div class=" bg-black">
    <div v-if="gameRunning" class="flex flex-col items-center h-[100vh]">
      <GameField class="flex-grow" :player-count="playerCount"></GameField>
      <p class="relative flex items-center justify-center py-2 min-h-max text-white text-3xl text-center">The Gravitron</p>
    </div>
    <TheMenu @choose-gamemode="startGame" v-else/>
  </div>
</template>

<style scoped>
</style>
