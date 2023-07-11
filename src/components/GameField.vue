<template>
  <div class="game-field relative h-[95vh] bg-zinc-800 text-gray-50 overflow-hidden">
    <GameFieldGravityChanger class="absolute top-[22.5%] w-full" />
    <GameFieldGravityChanger class="absolute bottom-[22.5%] w-full" />
    <GameFieldPlayer @move="handleMove" :gravity="gravity" :index="0"/>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import GameFieldGravityChanger from './GameFieldGravityChanger.vue'
import GameFieldPlayer from './GameFieldPlayer.vue'
import { Gravity } from '../types/Gravity.js' 
const gravity = ref<Gravity>(Gravity.normal)
const handleMove = (playerPosition: DOMRect): void => {
  console.log(playerPosition)
}
</script>

<style scoped>
</style>