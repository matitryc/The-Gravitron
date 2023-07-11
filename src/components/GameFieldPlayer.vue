<template>
  <div ref="player" class="player relative h-[9vh] w-[5vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-cyan-400">
    <div class="eye absolute top-[10%] -left-[10%] w-5 h-5 bg-black border-4 border-white"></div>
    <div class="eye absolute top-[10%] -right-[10%] w-5 h-5 bg-black border-4 border-white"></div>
    <div class="smile absolute left-1/2 top-1/2 w-3/4 h-[3px] -translate-x-[50%] bg-black"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import type { MovementValues, CurrentMovement, Direction } from '../types/Movement.js'
import type { Controls } from '../types/Controls.js'
const props = defineProps<{
  index: number,
  gravity: number
}>()
const emit = defineEmits(['move'])
const movementSpeed = 1
const horizontalMovement = 2
const player = ref<HTMLDivElement | null>(null)
const controls = <Controls[]>[
  {
    left: 'a',
    right: 'd'
  },
  {
    left: 'ArrowLeft',
    right: 'ArrowRight'
  },
  {
    left: 'j',
    right: 'l'
  }
]
const distance = reactive<MovementValues>({
  x: 0,
  y: 0
})
const moveIntervals = reactive<CurrentMovement>({
  left: undefined,
  right: undefined,
  up: undefined,
  down: undefined
})
const position = ref<DOMRect | null>(null)
const move = (direction: Direction): void => {
  if(position.value){
    if(direction === 'left'){
      const distanceFromLeft = position.value.x - horizontalMovement
      if(distanceFromLeft > 0){
        distance.x -= horizontalMovement
      }
    }
    else if(direction === 'right'){
      const distanceFromLeft = position.value.x + horizontalMovement
      const maxPlayerDistance = window.innerWidth - position.value.width
      if(distanceFromLeft < maxPlayerDistance){
        distance.x += horizontalMovement
      }
    }
  }
  emit('move', position.value)
}
const playerMove = (e: KeyboardEvent): void => {
  const key: string = e.key
  let direction: Direction = null  
  if(key === controls[props.index].left){
    direction = 'left'
  }
  else if(key === controls[props.index].right){
    direction = 'right'
  }
  if(direction && !moveIntervals[direction]){
    const intervalID = setInterval(() => move(direction), movementSpeed)
    moveIntervals[direction] = intervalID
  }
}
const playerStopMoving = (e: KeyboardEvent): void => {
  const key: string = e.key
  let direction: Direction = null
  if(key === controls[props.index].left){
    direction = 'left'
  }
  else if(key === controls[props.index].right){
    direction = 'right'
  }
  if(direction){
    clearInterval(moveIntervals[direction])
    moveIntervals[direction] = undefined
  }
}
watch(distance, () => {
  if(player.value){
    //-50% so it's positioned in the center at the beginning
    position.value = player.value.getBoundingClientRect()
    player.value.style.transform = `translate(Calc(-50% + ${distance.x}px), Calc(-50% + ${distance.y}px))`
  }
})
onMounted(() => {
  window.addEventListener('keydown', playerMove)
  window.addEventListener('keyup', playerStopMoving)
  if(player.value){
    position.value = player.value?.getBoundingClientRect()
  }
})
</script>

<style scoped>

</style>