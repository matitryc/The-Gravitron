<template>
  <div ref="gameField" class="game-field relative h-full w-full max-w-[130vh] bg-zinc-800 text-gray-50 overflow-hidden">
    <GameFieldBackground />
    <GameFieldTimer :checkpoint="checkpoint" />
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
        @finish="unspawnObstacle"
        :key="obstacle.id" 
        :obstacle="obstacle"
        :gameFieldRECT="gameFieldRECT"
      >
      </GameFieldObstacle>
    </div>
    <button @click="failGame" class="absolute bottom-[10%] left-1/2 -translate-x-1/2 bg-white px-8 py-4 text-black text-3xl">
      KILL!
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import GameFieldGravityChangers from './GameFieldGravityChangers.vue'
import GameFieldPlayer from './GameFieldPlayer.vue'
import GameFieldTimer from './GameFieldTimer.vue'
import GameFieldBackground from './GameFieldBackground.vue'
import GameFieldObstacle from './GameFieldObstacle.vue'
import type { Player, PlayerPosition } from '../types/Player.js'
import type { Obstacle } from '../types/Obstacle.js'
import type { Interval } from '../types/Interval.js'
import { useFail } from './../composables/useFail.js'
import { useGameTime } from './../composables/useGameTime.js'
const { fail, failGame } = useFail()
const { gameTimeInMiliseconds, start, pauseTime, timeInterval } = useGameTime()
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
    spawnTime: 57000,
    direction: 'right',
    spawned: false
  }
])
const timeIntervalId = ref<Interval>(undefined)
const checkpoint = ref(gameTimeInMiliseconds.value)
const end = ref(false)
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
const setTimer = () => {
  timeIntervalId.value = setInterval(() => {
    gameTimeInMiliseconds.value -= timeInterval
  }, timeInterval)
}
const revertToCheckpoint = () => {
  clearInterval(timeIntervalId.value)
  const showFullRevertTime = 500 //just for UI
  const revert: number = checkpoint.value - gameTimeInMiliseconds.value
  const revertIntervalValue: number = Math.ceil(revert / ((pauseTime - showFullRevertTime) / timeInterval))
  //1200 ms equally distributed in 2 seconds
  let revertIntervalId = setInterval(() => {
    gameTimeInMiliseconds.value += revertIntervalValue
  }, timeInterval)
  setTimeout(() => {
    clearInterval(revertIntervalId)
    gameTimeInMiliseconds.value = checkpoint.value
  }, pauseTime - showFullRevertTime)
  setTimeout(() => {
    setTimer()
  }, pauseTime)
}
const setPlayersCheckpoint = () => {
  players.value.forEach(player => {
    player.checkpointPosition = player.position
    player.checkpointGravity = player.gravity
  })
}
const unspawnAllObstacles = () => {
  obstacles.value.forEach(obstacle => obstacle.spawned = false)
}
const unspawnObstacle = (id: number) => { 
  const obstacleToUnspawn = obstacles.value.find(obstacle => obstacle.id === id)
  if(obstacleToUnspawn){
    obstacleToUnspawn.spawned = false
  }
}
watch(gameTimeInMiliseconds, () => {
  if(!fail.value){
    const obstacleToSpawn = obstacles.value.find(obstacle => obstacle.spawnTime === gameTimeInMiliseconds.value)
    if(obstacleToSpawn){
      obstacleToSpawn.spawned = true
    }
  }
  if(gameTimeInMiliseconds.value % 5000 === 0 && gameTimeInMiliseconds.value !== 0 && !fail.value){
    checkpoint.value = gameTimeInMiliseconds.value
    setPlayersCheckpoint()
  }
  if(gameTimeInMiliseconds.value <= 0){
    end.value = true
  }
})
watch(start, () => {
  if(start.value){
    setTimer()
    setPlayersCheckpoint()
  }
})
watch(fail, () => {
  if(fail.value){
    revertToCheckpoint()
    unspawnAllObstacles()
  }
})
onMounted(() => {
  gameFieldRECT.value = gameField.value?.getBoundingClientRect()
  window.addEventListener('resize', () => {
    gameFieldRECT.value = gameField.value?.getBoundingClientRect()
  })
  setTimeout(() => {
    start.value = true
  }, 3500)
})
</script>

<style scoped>
</style>