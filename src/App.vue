<script setup lang="ts">
import { ref, computed } from 'vue'
import GameField from './components/GameField.vue'
import TheMenu from './components/TheMenu.vue'
import { useFail } from './composables/useFail.js'
import { useGameTime } from './composables/useGameTime.js'
const { failCounter } = useFail()
const { resetGameTime } = useGameTime()
const playerCount = ref<number>(1)
const gameRunning = ref(false)
const endScreen = ref(false)
const setPlayerCount = (value: number) => {
  playerCount.value = value
}
const endGame = () => {
  gameRunning.value = false
  endScreen.value = true
}
const resetGame = () => {
  resetGameTime()
  failCounter.value = 0
  endScreen.value = false
}
const endGameMessage = computed(() => {
  if(failCounter.value === 0){
    return 'Wow. The actual game would be a breeze for you!'
  }
  else if(failCounter.value < 5) {
    return 'You did really well, nice job : )'
  }
  else {
    return 'Not bad, but the score can be improved upon! Maybe next time it\'ll go better ; )'
  }
})
</script>

<template>
  <div 
    class="flex items-center justify-center bg-black min-h-[100dvh] text-white overflow-y-auto p-16"
    :class="{ 'p-0': gameRunning }"
  >
    <TheMenu @start-game="gameRunning = true" @choose-gamemode="setPlayerCount" v-if="!gameRunning && !endScreen"/>
    <div v-if="gameRunning" class="absolute flex flex-col items-center h-[100dvh] w-full">
      <GameField @end="endGame" class="flex-grow h-full" :player-count="playerCount"></GameField>
      <p class="relative flex items-center justify-center py-2 min-h-max text-white text-3xl text-center">The Gravitron</p>
    </div>
    <div class="flex flex-col gap-8 items-center jusify-center text-center" v-if="endScreen">
      <p class="text-4xl uppercase">congratulations!</p>
      <p class="text-2xl">
        Fail Counter: {{ failCounter }}
      </p>
      <p class="text-xl">
        {{ endGameMessage }}
      </p>
      <button @click="resetGame" class="bg-white text-black py-4 px-8 text-2xl uppercase">
        try again?
      </button>
    </div>
  </div>
</template>

<style scoped>
</style>
