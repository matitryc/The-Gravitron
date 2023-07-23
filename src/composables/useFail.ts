import { ref } from 'vue'

const fail = ref(false)
const pauseTime = 2000

const failGame = () => {
  fail.value = true
  setTimeout(() => {
    fail.value = false
  }, pauseTime)
}

export const useFail = () => {
  return {
    fail,
    pauseTime,
    failGame
  }
}