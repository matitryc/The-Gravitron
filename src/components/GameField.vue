<template>
  <div class="game-field relative h-[95vh] bg-zinc-800 text-gray-50">
    <GameFieldGravityChanger class="absolute top-[22.5%] w-full" />
    <GameFieldGravityChanger class="absolute bottom-[22.5%] w-full" />
    <GameFieldPlayer />
  </div>
</template>

<script setup lang="ts">
import GameFieldGravityChanger from './GameFieldGravityChanger.vue'
import GameFieldPlayer from './GameFieldPlayer.vue'
</script>

<style scoped>
</style>