import { ref } from 'vue'

export default () => {
  const fail = ref(false)
  const pauseTime = 2000

  const failGame = () => {
    fail.value = true
    console.log('fail', fail.value)
    setTimeout(() => {
      fail.value = false
    }, pauseTime)
  }
  
  return {
    fail,
    pauseTime,
    failGame
  }
}