<template>
  <div ref="gameField" class="game-field relative h-full w-full max-w-[130vh] bg-zinc-800 text-gray-50 overflow-hidden">
    <GameFieldGravityChangers @change-gravity="changePlayerGravity" :positionedPlayer="currentPlayerPosition" />
    <GameFieldPlayer 
      v-for="(player, index) in players" 
      :key="player.id"  
      @position-change="changePlayerPosition"
      @collision="player.collides = true"
      @freedom="player.collides = false"
      :index="index" 
      :gameFieldRECT="gameFieldRECT" 
      :player="player"

    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import GameFieldGravityChangers from './GameFieldGravityChangers.vue'
import GameFieldPlayer from './GameFieldPlayer.vue'
import type { Player, PlayerPosition } from '../types/Player.js'
const players = ref<Player[]>([
  {
    id: Math.random(),
    gravity: 'down',
    controls: {
      left: 'a',
      right: 'd'
    },
    collides: false
  }
])
const gameField = ref<HTMLDivElement | null>(null)
const gameFieldRECT = ref<DOMRect | null>(null)
const playerPositions = ref<PlayerPosition[]>([])
const currentPlayerPosition = ref<PlayerPosition | null>(null)
const changePlayerPosition = (newPosition: PlayerPosition): void => {
  currentPlayerPosition.value = newPosition
  const oldPosition = playerPositions.value.find(position => position.id === newPosition.id)
  if(oldPosition){
    const oldPositionIndex = playerPositions.value.indexOf(oldPosition)
    playerPositions.value.splice(oldPositionIndex, 1, newPosition)
  }
  else {
    playerPositions.value.push(newPosition)
  }
}
const changePlayerGravity = (id: number): void => {
  const collidedPlayer: Player | undefined = players.value.find(player => player.id === id)
  if(collidedPlayer){
    if(collidedPlayer.gravity === 'down'){
      collidedPlayer.gravity = 'up'
    }
    else {
      collidedPlayer.gravity = 'down'
    }
  }
}
onMounted(() => {
  if(gameField.value){
    gameFieldRECT.value = gameField.value?.getBoundingClientRect()
  }
})
</script>

<style scoped>
</style>