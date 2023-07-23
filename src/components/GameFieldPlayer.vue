<template>
  <img ref="container"  :src="`./../../player_${index}.png`" class="player absolute h-[9vh] opacity-90">
  <GameFieldPlayerDoppelganger 
    v-if="player.collides"
    @switch="switchPlayerWithDoppelganger"
    :index="index" 
    :playerPosition="playerRECT" 
    :gravityRotate="gravityRotate" 
    :directionRotate="directionYRotate"
    :gameFieldRECT="gameFieldRECT"
    :src="`./../../player_${index}.png`" 
  />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import type { CurrentMovement, HorizontalDirection } from '../types/Movement.js'
import type { Player } from '../types/Player.js'
import type { Gravity } from '../types/Gravity.js'
import type { Interval } from '../types/Interval.js'
import GameFieldPlayerDoppelganger from './GameFieldPlayerDoppelganger.vue'
import { useFail } from '../composables/useFail.js'
const { fail, pauseTime } = useFail()
const props = defineProps<{
  gameFieldRECT: DOMRect | undefined
  player: Player
  index: number
}>()
const emit = defineEmits<{
  (e: 'position-change', value: { id: number, position: DOMRect }): void
  (e: 'collision'): void
  (e: 'freedom'): void
}>()
const movementInterval = 1
const horizontalMovement = ref<number>(0)
const verticalMovement = ref<number>(0)
const gravityRotate = ref(0)
const directionYRotate = ref<0 | 180>(180)
const playerRECT = ref<DOMRect | undefined>()
const container = ref<HTMLImageElement | undefined>()
const distance = reactive({
  x: window.innerWidth / 2,
  y: window.innerHeight / 2
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
    emit('position-change', { id: props.player.id, position: playerRECT.value })
  }
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
    const intervalID: Interval = setInterval(() => handleDistance(direction), movementInterval)
    moveIntervals[direction] = intervalID
  }
}
const moveVertically = (): void => {
  moveIntervals.down = undefined
  moveIntervals.up = undefined
  const verticalInterval: Interval = setInterval(() => handleDistance(props.player.gravity), movementInterval)
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
const setPlayerTransform = () => {
  if(container.value){
    container.value.style.transform = `
      translate(${distance.x}px, ${distance.y}px) 
      rotateX(${gravityRotate.value}deg) 
      rotateY(${directionYRotate.value}deg)
    `
  }
}
const stopAllHorizontalMovement = () => {
  clearInterval(moveIntervals.left)
  moveIntervals.left = undefined
  clearInterval(moveIntervals.right)
  moveIntervals.right = undefined
}
const stopVerticalMovement = () => {
  clearInterval(moveIntervals.up)
  moveIntervals.up = undefined
  clearInterval(moveIntervals.down)
  moveIntervals.down = undefined
}
const setPlayersDistanceAndGravityRotation = (): void => {
    //-50% so it's positioned in the center at the beginning
    if(moveIntervals.right){
      directionYRotate.value = 0
    }
    else if(moveIntervals.left){
      directionYRotate.value = 180
    }
    setPlayerTransform()
}
const switchPlayerWithDoppelganger = (): void => {
  if(props.gameFieldRECT && playerRECT.value){
    if(distance.x >= props.gameFieldRECT.x / 2){
      distance.x = playerRECT.value.width
    }
    else {
      distance.x = props.gameFieldRECT.width - playerRECT.value.width
    }
  }
}
watch(props, () => {
  setGravityRotate()
  setPlayersDistanceAndGravityRotation()
  if(props.gameFieldRECT){
    horizontalMovement.value = props.gameFieldRECT.width / 360 //3px on full res
    verticalMovement.value = props.gameFieldRECT.height / 225
  }
})
watch(fail, () => {
  if(fail.value){
    stopAllHorizontalMovement()
    stopVerticalMovement()
    window.removeEventListener('keydown', moveHorizontally)
    setTimeout(() => {
      if(props.player.checkpointPosition && props.gameFieldRECT){
        distance.x = props.player.checkpointPosition.x - (window.innerWidth - props.gameFieldRECT.width) / 2
        distance.y = props.player.checkpointPosition.y
        setPlayerTransform()
      }
    }, pauseTime / 2)
    setTimeout(() => {
      moveVertically()
      window.addEventListener('keydown', moveHorizontally)
    }, pauseTime)
  }
})
watch(distance, () => {
  setPlayersDistanceAndGravityRotation()
  playerRECT.value = container.value?.getBoundingClientRect()
})
onMounted(() => {
  moveVertically()
  setGravityRotate()
  playerRECT.value = container.value?.getBoundingClientRect()
  window.addEventListener('keydown', moveHorizontally)
  window.addEventListener('keyup', stopOneHorizontalMovement)
  window.addEventListener('blur', stopAllHorizontalMovement)
  window.addEventListener('resize', () => {
    playerRECT.value = container.value?.getBoundingClientRect()
  })
})
</script>

<style scoped>
</style>