import { ref } from 'vue'

const start = ref(false)
const gameTimeInMiliseconds = ref(60000)
const pauseTime = 2000
const timeInterval = 25

export const useGameTime = () => {
  return {
    gameTimeInMiliseconds,
    start,
    pauseTime,
    timeInterval
  }
}