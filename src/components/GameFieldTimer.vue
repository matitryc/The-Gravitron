<template>
  <span class="absolute flex items-center justify-center text-center text-5xl h-[22.5%] w-full">
    <span v-if="!start" class="timer-start flex flex-col justify-center text-center h-full blink">
      <span>Survive for</span>
      <span>60 seconds!</span>
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
import { ref, onMounted, watch, computed } from 'vue'
import type { Interval } from '../types/Interval.js'
import useFail from '../composables/useFail.js'
const { pauseTime, fail } = useFail()
const emit = defineEmits<{
  (e: 'checkpoint', value: number): void
}>()
const start = ref(false)
const checkpoint = ref(0)
const gameTimeInMiliseconds = ref(60000)
const timeInterval = 25
const timeIntervalId = ref<Interval>(undefined)
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
const setTimer = () => {
  timeIntervalId.value = setInterval(() => {
    gameTimeInMiliseconds.value -= timeInterval
  }, timeInterval)
}
const revertToCheckpoint = () => {
  if(timeIntervalId.value){
    clearInterval(timeIntervalId.value)
  }
  const showFullRevertTime = 500 //just for UI
  const revert: number = checkpoint.value - gameTimeInMiliseconds.value
  const revertIntervalValue: number = Math.ceil(revert / ((pauseTime - showFullRevertTime) / timeInterval))
  //1200 rowno przez 2000 czasu co 25 czasu
  let revertIntervalId = setInterval(() => {
    gameTimeInMiliseconds.value += revertIntervalValue
  }, timeInterval)
  setTimeout(() => {
    clearInterval(revertIntervalId)
    gameTimeInMiliseconds.value = checkpoint.value
  }, pauseTime - showFullRevertTime)
  setTimeout(() => {
    setTimer()
  }, pauseTime)
}
watch(fail, () => {
  console.log(fail)
  if(fail){
    revertToCheckpoint()
  }
})
watch(start, () => {
  if(start.value){
    setTimer()
  }
})
watch(gameTimeInMiliseconds, () => {
  if(gameTimeInMiliseconds.value % 5000 === 0 && gameTimeInMiliseconds.value !== 0){
    checkpoint.value = gameTimeInMiliseconds.value
    emit('checkpoint', checkpoint.value)
  }
  if(gameTimeInMiliseconds.value === 0 && timeIntervalId.value){
    clearInterval(timeIntervalId.value)
  }
}, { immediate: true })
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