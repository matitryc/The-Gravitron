<template>
  <span class="absolute flex items-center justify-center text-center text-5xl h-[22.5%] w-full">
    <span v-if="!start" class="timer-start flex flex-col justify-center text-center h-full blink">
      <span>Survive for</span>
      <span>60 seconds!</span>
    </span>
    <span v-else class="timer flex items-center h-full text-5xl">
      <span>
        {{ secondsRefactored }}
      </span>
      :
      <span>
        {{ milisecondsRefactored }}
      </span>
    </span>
  </span>
 
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
defineProps<{
  fail: boolean
}>()
const start = ref(false)
const gameTimeInMiliseconds = ref(60000)
const timeInterval = ref<number | null>(null)
const seconds = computed(() => {
  return Math.floor(gameTimeInMiliseconds.value / 1000)
})
const secondsRefactored = computed<string>(() => {
  return seconds.value >= 10 ? `${seconds.value}` : `0${seconds.value}`
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
watch(start, () => {
  if(start.value){
    const interval = 25
    timeInterval.value = setInterval(() => {
      gameTimeInMiliseconds.value -= interval
    }, interval)
  }
})
watch(gameTimeInMiliseconds, () => {
  if(gameTimeInMiliseconds.value === 0 && timeInterval.value){
    clearInterval(timeInterval.value)
  }
})
onMounted(() => {
  setTimeout(() => {
    start.value = true
  }, 3500)
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