<template>
  <div ref="player" class="player relative h-[9vh] w-[5vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-cyan-400">
    <div class="eye absolute top-[10%] -left-[10%] w-5 h-5 bg-black border-4 border-white"></div>
    <div class="eye absolute top-[10%] -right-[10%] w-5 h-5 bg-black border-4 border-white"></div>
    <div class="smile absolute left-1/2 top-1/2 w-3/4 h-[3px] -translate-x-[50%] bg-black"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import type { MovementValues, CurrentMovement } from '../types/Movement.js'
import type { Controls } from '../types/Controls.js'
const props = defineProps<{
  index: number
}>()
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
  left: null,
  right: null,
  up: null,
  down: null
})
const position = ref<DOMRect | null>(null)
const move = {
  left: (): void => {
    if(position.value){
      const nextDistance = position.value.x - horizontalMovement
      if(nextDistance > 0){
        distance.x -= horizontalMovement
      }
    }
  },
  right: (): void => {
    if(position.value){
      const nextDistance = position.value.x + horizontalMovement
      const playerStickingToRightBorderDistance = window.innerWidth - position.value.width
      if(nextDistance < playerStickingToRightBorderDistance){
        distance.x += horizontalMovement
      }
    }
  }
}
const handleMovementIntervalSet = (e: KeyboardEvent): void => {
  const key: string = e.key
  if(key === controls[props.index].left){
    if(!moveIntervals.left){
      const leftIntervalID = setInterval(move.left, movementSpeed)
      moveIntervals.left = leftIntervalID
    }
  }
  else if(key === controls[props.index].right){
    if(!moveIntervals.right){
      const rightIntervalID = setInterval(move.right, movementSpeed)
      moveIntervals.right = rightIntervalID
    }
  }
}
const handleMovementIntervalsRemoval = (e: KeyboardEvent): void => {
  const key: string = e.key
  if(key === controls[props.index].left){
    if(moveIntervals.left){
      clearInterval(moveIntervals.left)
      moveIntervals.left = null
    }
  }
  else if(key === controls[props.index].right){
    if(moveIntervals.right){
      clearInterval(moveIntervals.right)
      moveIntervals.right = null
    }
  }
}
watch(distance, () => {
  if(player.value){
    //-50% so it's positioned in the center at the beggining
    position.value = player.value.getBoundingClientRect()
    player.value.style.transform = `translate(Calc(-50% + ${distance.x}px), Calc(-50% + ${distance.y}px))`
  }
})
onMounted(() => {
  window.addEventListener('keydown', handleMovementIntervalSet)
  window.addEventListener('keyup', handleMovementIntervalsRemoval)
  if(player.value){
    position.value = player.value?.getBoundingClientRect()
  }
})
</script>

<style scoped>

</style>