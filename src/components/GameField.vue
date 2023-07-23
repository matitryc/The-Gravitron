<template>
  <div ref="gameField" class="game-field relative h-full w-full max-w-[130vh] bg-zinc-800 text-gray-50 overflow-hidden">
    <GameFieldBackground />
    <GameFieldTimer @checkpoint="setPlayersCheckpoint" />
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
    <div class="obstacles absolute top-[20%] bottom-[20%] w-full">
      <GameFieldObstacle 
        v-for="obstacle in obstacles" 
        :key="obstacle.id" 
        :obstacle="obstacle">
      </GameFieldObstacle>
    </div>
    <button @click="failGame" class="absolute bottom-[10%] left-1/2 -translate-x-1/2 bg-white px-8 py-4 text-black text-3xl">
      KILL!
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import GameFieldGravityChangers from './GameFieldGravityChangers.vue'
import GameFieldPlayer from './GameFieldPlayer.vue'
import GameFieldTimer from './GameFieldTimer.vue'
import GameFieldBackground from './GameFieldBackground.vue'
import GameFieldObstacle from './GameFieldObstacle.vue'
import type { Player, PlayerPosition } from '../types/Player.js'
import type { Obstacle } from '../types/Obstacle.js'
import { useFail } from './../composables/useFail.js'
const { failGame } = useFail()
const players = ref<Player[]>([
  {
    id: Math.random(),
    gravity: 'down',
    controls: {
      left: 'a',
      right: 'd'
    },
    collides: false,
    position: null,
    checkpointPosition: null,
    checkpointGravity: null
  }
])
const obstacles = ref<Obstacle[]>([
  {
    id: Math.random(),
    row: 1,
    spawnTime: 1000,
    direction: 'right',
    visible: true
  }
])
const gameField = ref<HTMLDivElement | undefined>()
const gameFieldRECT = ref<DOMRect | undefined>()
const currentPlayerPosition = ref<PlayerPosition | undefined>()
const changePlayerPosition = (newPosition: PlayerPosition): void => {
  currentPlayerPosition.value = newPosition
  const player = players.value.find(player => player.id === newPosition.id)
  if(player){
    player.position = newPosition.position
    if(!player.checkpointPosition){
      player.checkpointPosition = newPosition.position
    }
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
const setPlayersCheckpoint = () => {
  players.value.forEach(player => {
    player.checkpointPosition = player.position
    player.checkpointGravity = player.gravity
  })
}
onMounted(() => {
  gameFieldRECT.value = gameField.value?.getBoundingClientRect()
  window.addEventListener('resize', () => {
    gameFieldRECT.value = gameField.value?.getBoundingClientRect()
  })
})
</script>

<style scoped>
</style>