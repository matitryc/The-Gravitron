import { ref } from 'vue'
import { useGameTime } from './useGameTime'
const { pauseTime } = useGameTime()
const fail = ref(false)

const failGame = () => {
  fail.value = true
  setTimeout(() => {
    fail.value = false
  }, pauseTime)
}

export const useFail = () => {
  return {
    fail,
    failGame
  }
}