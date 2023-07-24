import { ref } from 'vue'

const start = ref(false)
const gameTimeInMiliseconds = ref(60000)
const pauseTime = 2000
const second = 1000
const halfSecond = 500
const fiveSeconds = 5000
const timeInterval = 25

export const useGameTime = () => {
  return {
    gameTimeInMiliseconds,
    start,
    pauseTime,
    timeInterval,
    fiveSeconds,
    halfSecond,
    second
  }
}