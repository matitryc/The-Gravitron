import { ref } from 'vue'

const gameTimeInMiliseconds = ref(60000)

export const useGameTime = () => {
  return {
    gameTimeInMiliseconds
  }
}