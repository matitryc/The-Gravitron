<template>
  <TheMenuInstructions @instructions-read="startGame" v-if="instructionsShown"/>
  <div v-else class="flex flex-col justify-center items-center gap-16 bg-black text-white h-full">
    <p class="text-5xl md:text-6xl text-center lg:text-7xl">The Gravitron</p>
    <p class="text-lg lg:text-xl max-w-screen-xl text-center">
      The Gravitron is a replica of a fragment from the game 
      <a 
        href="https://thelettervsixtim.es"
        class="text-blue-200"
        target="_blank" 
        rel="noopener norefer"
      >
        VVVVVV.
      </a>
      It's a platformer, a totally different project that any other thing I worked on as a frontend developer. Not only I refined my abilities of Vue and TypeScript, but also I got to get creative and create solutions I didn't think about before. I hope you enjoy : )))
      <br>
      <span class="block text-md lg:text-lg mt-6">
        (I don't claim the rights to the  game, the actual creator is Terry Cavanagh. I only copied one of the fragments from HIS game.)
      </span>
    </p>
    <div class="play-options flex flex-col 2xl:flex-row gap-16 text-xl lg:text-3xl">
      <button 
        v-for="(option, index) in ['singleplayer', 'two player co-op', 'gravity trio']" 
        :key="option" @click="() => chooseGamemode(index+1)" 
        class="option text-black bg-white p-4"
      >
        <p class="uppercase">
          {{ option }}
        </p>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TheMenuInstructions from './TheMenuInstructions.vue'
const emit = defineEmits<{
  (e: 'choose-gamemode', value: number): void
  (e: 'start-game'): void
}>()
const instructionsShown = ref(false)
const chooseGamemode = (playerCount: number) => {
  emit('choose-gamemode', playerCount)
  instructionsShown.value = true
}
const startGame = () => {
  instructionsShown.value = false
  emit('start-game')
}
</script>

<style lang="scss" scoped>

</style>