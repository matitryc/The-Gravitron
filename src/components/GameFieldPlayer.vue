<template>
  <img ref="container"  :src="`./../../player_${index}.png`" class="player relative h-[9vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-90">
  <GameFieldPlayerDoppelganger 
    v-if="player.collides"
    @switch="switchPlayerWithDoppelganger"
    :index="index" 
    :playerPosition="playerRECT" 
    :gravityRotate="gravityRotate" 
    :directionRotate="directionYRotate"
    :gameFieldRECT="gameFieldRECT"
  />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import type { CurrentMovement, HorizontalDirection } from '../types/Movement.js'
import type { Player } from '../types/Player.js'
import type { Gravity } from '../types/Gravity.js'
import GameFieldPlayerDoppelganger from './GameFieldPlayerDoppelganger.vue'
const props = defineProps<{
  gameFieldRECT: DOMRect | null
  player: Player
  index: number
}>()
const emit = defineEmits(['position-change', 'collision', 'freedom'])
const movementInterval = 1
const horizontalMovement = ref<number>(0)
const verticalMovement = ref<number>(0)
const gravityRotate = ref(0)
const directionYRotate = ref<0 | 180>(180)
const playerRECT = ref<DOMRect | null>(null)
const container = ref<HTMLImageElement | null>(null)
const distance = reactive({
  x: 0,
  y: 0
})
const moveIntervals = reactive<CurrentMovement>({
  left: undefined,
  right: undefined,
  up: undefined,
  down: undefined
})
const setGravityRotate = (): void => {
  if(props.player.gravity === 'down'){
    gravityRotate.value = 0
  }
  else {
    gravityRotate.value = 180
  }
}
const handleDistance = (direction: HorizontalDirection | Gravity): void => {
  if(playerRECT.value && props.gameFieldRECT){
    const maxHorizontal = ((window.innerWidth - props.gameFieldRECT.width) / 2) + props.gameFieldRECT.width - playerRECT.value.width
    const minHorizontal = (window.innerWidth - props.gameFieldRECT.width) / 2
    const distanceFromLeft = playerRECT.value.x
    if(distanceFromLeft + horizontalMovement.value >= maxHorizontal || distanceFromLeft - horizontalMovement.value <= minHorizontal){
      emit('collision')
    }
    else {
      emit('freedom')
    }
    if(direction === 'left' && !moveIntervals.right){
      distance.x -= horizontalMovement.value
    }
    else if(direction === 'right' && !moveIntervals.left){
      distance.x += horizontalMovement.value
    }
    else if(direction === 'up'){
      const distanceFromTop = playerRECT.value.y - verticalMovement.value
      if(distanceFromTop > 0){
        distance.y -= verticalMovement.value
      }
    }
    else if(direction === 'down'){
      const distanceFromTop = playerRECT.value.y + verticalMovement.value
      const maxVertical = window.innerHeight - playerRECT.value.height
      if(distanceFromTop < maxVertical){
        distance.y += verticalMovement.value
      }
    }
  }
  emit('position-change', { id: props.player.id, position: playerRECT.value })
}
const moveHorizontally = (e: KeyboardEvent): void => {
  const key: string = e.key
  let direction: HorizontalDirection = null  
  if(key === props.player.controls.left){
    direction = 'left'
  }
  else if(key === props.player.controls.right){
    direction = 'right'
  }
  if(direction && !moveIntervals[direction]){
    const intervalID = setInterval(() => handleDistance(direction), movementInterval)
    moveIntervals[direction] = intervalID
  }
}
const moveVertically = (): void => {
  moveIntervals.down = undefined
  moveIntervals.up = undefined
  const verticalInterval = setInterval(() => handleDistance(props.player.gravity), movementInterval)
  moveIntervals[props.player.gravity] = verticalInterval
} 
const stopOneHorizontalMovement = (e: KeyboardEvent): void => {
  const key: string = e.key
  let direction: HorizontalDirection = null
  if(key === props.player.controls.left){
    direction = 'left'
  }
  else if(key === props.player.controls.right){
    direction = 'right'
  }
  if(direction){
    clearInterval(moveIntervals[direction])
    moveIntervals[direction] = undefined
  }
}
const stopAllHorizontalMovement = () => {
  clearInterval(moveIntervals.left)
  moveIntervals.left = undefined
  clearInterval(moveIntervals.right)
  moveIntervals.right = undefined
}
const setPlayersDistanceAndGravityRotation = (): void => {
  if(container.value){
    //-50% so it's positioned in the center at the beginning
    if(moveIntervals.right){
      directionYRotate.value = 0
    }
    else if(moveIntervals.left){
      directionYRotate.value = 180
    }
    container.value.style.transform = `
      translate(Calc(-50% + ${distance.x}px), Calc(-50% + ${distance.y}px)) 
      rotateX(${gravityRotate.value}deg) 
      rotateY(${directionYRotate.value}deg)
    `
  }
}
const switchPlayerWithDoppelganger = (): void => {
  if(props.gameFieldRECT && playerRECT.value){
    let oppositeDistance: number
    if(playerRECT.value.x >= props.gameFieldRECT.width / 2){
      oppositeDistance = - props.gameFieldRECT.width / 2 + playerRECT.value.width / 2
    }
    else {
      oppositeDistance = props.gameFieldRECT.width / 2 - playerRECT.value.width / 2
    }
    distance.x = oppositeDistance
  }
}
watch(props, () => {
  setGravityRotate()
  setPlayersDistanceAndGravityRotation()
  if(props.gameFieldRECT){
    horizontalMovement.value = props.gameFieldRECT.width / 360 //3px on full res
    verticalMovement.value = props.gameFieldRECT.height / 286 //3px on full res
  }
})
watch(distance, () => {
  setPlayersDistanceAndGravityRotation()
  if(container.value){
    playerRECT.value = container.value.getBoundingClientRect()
  }
})
onMounted(() => {
  window.addEventListener('keydown', moveHorizontally)
  window.addEventListener('keyup', stopOneHorizontalMovement)
  window.addEventListener('blur', stopAllHorizontalMovement)
  window.addEventListener('resize', () => {
    if(container.value){
      playerRECT.value = container.value.getBoundingClientRect()
    }
  })
  moveVertically()
  setGravityRotate()
  if(container.value){
    playerRECT.value = container.value?.getBoundingClientRect()
  }
})
</script>

<style scoped>
</style>