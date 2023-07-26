import { ref } from 'vue'
import { useGameTime } from './useGameTime'
const { pauseTime } = useGameTime()
const fail = ref(false)
const failCounter = ref(0)

const failGame = () => {
  fail.value = true
  failCounter.value ++ 
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