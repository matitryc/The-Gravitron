import { ref } from 'vue'

const start = ref(false)
const fixedGameTime = 40000
const gameTimeInMiliseconds = ref(fixedGameTime)
const pauseTime = 2000
const second = 1000
const halfSecond = 500
const fiveSeconds = 5000
const timeInterval = 25

const resetGameTime = () => {
  start.value = false
  gameTimeInMiliseconds.value = fixedGameTime
}

export const useGameTime = () => {
  return {
    gameTimeInMiliseconds,
    start,
    pauseTime,
    timeInterval,
    fiveSeconds,
    halfSecond,
    second,
    resetGameTime
  }
}