<template>
  <img :src="`./../../player_${index}.png`" ref="container" class="player relative h-[9vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-90">
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import type { Distance, CurrentMovement, HorizontalDirection } from '../types/Movement.js'
import type { Player } from '../types/Player.js'
import type { Gravity } from '../types/Gravity.js'
const props = defineProps<{
  gameFieldRECT: DOMRect | null
  player: Player
  index: number
}>()
const emit = defineEmits(['position-change'])
const movementInterval = 1
const horizontalMovement = ref<number>(0)
const verticalMovement = ref<number>(0)
const gravityRotate = ref(0)
const directionYRotate = ref<0 | 180>(180)
const container = ref<HTMLImageElement | null>(null)
const distance = reactive<Distance>({
  x: 0,
  y: 0
})
const moveIntervals = reactive<CurrentMovement>({
  left: undefined,
  right: undefined,
  up: undefined,
  down: undefined
})
const playerRECT = ref<DOMRect | null>(null)
const setGravityRotate = (): void => {
  if(props.player.gravity === 'down'){
    gravityRotate.value = 0
  }
  else {
    gravityRotate.value = 180
  }
}
const setDistance = (direction: HorizontalDirection | Gravity): void => {
  if(playerRECT.value && props.gameFieldRECT){
    if(direction === 'left' && !moveIntervals.right){
      const distanceFromLeft = playerRECT.value.x - horizontalMovement.value
      const minHorizontal = (window.innerWidth - props.gameFieldRECT.width) / 2
      if(distanceFromLeft > minHorizontal){
        distance.x -= horizontalMovement.value
      }
    }
    else if(direction === 'right' && !moveIntervals.left){
      const distanceFromLeft = playerRECT.value.x + horizontalMovement.value
      const maxHorizontal = ((window.innerWidth - props.gameFieldRECT.width) / 2) + props.gameFieldRECT.width - playerRECT.value.width
      if(distanceFromLeft < maxHorizontal){
        distance.x += horizontalMovement.value
      }
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
    const intervalID = setInterval(() => setDistance(direction), movementInterval)
    moveIntervals[direction] = intervalID
  }
}
const moveVertically = (): void => {
  moveIntervals.down = undefined
  moveIntervals.up = undefined
  const verticalInterval = setInterval(() => setDistance(props.player.gravity), movementInterval)
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
    container.value.style.transform = `translate(Calc(-50% + ${distance.x}px), Calc(-50% + ${distance.y}px)) rotateX(${gravityRotate.value}deg) rotateY(${directionYRotate.value}deg)`
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