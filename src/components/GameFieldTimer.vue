<template>
  <span class="absolute flex items-center justify-center text-center text-2xl lg:text-3xl xl:text-5xl h-[20%] w-full">
    <span v-if="!start" class="timer-start flex flex-col justify-center text-center h-full blink">
      <span>Survive for</span>
      <span>{{ seconds }} seconds!</span>
    </span>
    <span v-else class="timer flex items-center h-full text-5xl">
      <span>
        {{ seconds }}
      </span>
      :
      <span>
        {{ milisecondsRefactored }}
      </span>
    </span>
  </span>
 
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameTime } from '../composables/useGameTime.js'
const { gameTimeInMiliseconds, start } = useGameTime()
defineProps<{
  checkpoint: number
}>()
const seconds = computed(() => {
  return Math.floor(gameTimeInMiliseconds.value / 1000)
})
const miliseconds = computed(() => {
  return gameTimeInMiliseconds.value - seconds.value * 1000
})
const milisecondsRefactored = computed<string>(() => {
  if(miliseconds.value >= 100){
    return `${Math.floor(miliseconds.value / 10)}`
  }
  else if(miliseconds.value >= 10){
    return `${miliseconds.value}`
  }
  else {
    return `0${miliseconds.value}`
  }
})
</script>

<style lang="scss" scoped>
.blink {
  animation: blink 1s infinite linear;
}
@keyframes blink {
  0% {
    opacity: 1
  }
  49% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}
</style>