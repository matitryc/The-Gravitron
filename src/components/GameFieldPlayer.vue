<template>
  <div>
    <img 
      ref="container"  
      :src="imgSource"
      class="player absolute h-[9vh] opacity-90"
      :class="{ 'respawnBlink': isRespawning }"
    >
    <GameFieldPlayerDoppelganger 
      v-if="player.collides"
      @switch="switchPlayerWithDoppelganger"
      :index="index" 
      :playerPosition="playerRECT" 
      :gravityRotate="gravityRotate" 
      :directionRotate="directionYRotate"
      :gameFieldRECT="gameFieldRECT"
      :src="imgSource"
      :class="{ 'respawnBlink': isRespawning }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from 'vue'
import type { CurrentMovement, HorizontalDirection } from '../types/Movement.js'
import type { Player } from '../types/Player.js'
import type { Gravity } from '../types/Gravity.js'
import type { Interval } from '../types/Interval.js'
import GameFieldPlayerDoppelganger from './GameFieldPlayerDoppelganger.vue'
import { useFail } from '../composables/useFail.js'
import { useGameTime } from '../composables/useGameTime'
const { fail } = useFail()
const { pauseTime } = useGameTime()
const props = defineProps<{
  gameFieldRECT: DOMRect | undefined
  player: Player
  index: number
}>()
const emit = defineEmits<{
  (e: 'position-change', value: { id: number, position: DOMRect }): void
  (e: 'collision'): void
  (e: 'freedom'): void
  (e: 'change-gravity-to-checkpoint', value: Player): void
}>()
const initialFail = ref(false)
const movementInterval = 5
const horizontalMovement = ref<number>(0)
const verticalMovement = ref<number>(0)
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
const isRespawning = computed(() => {
  return !initialFail.value && fail.value
})
const imgSource = computed(() => {
  return !initialFail.value ? `./../../player_${props.index}.png` : './../../player_fail.png'
})
const stylePauseTime = computed(() => {
  return `${pauseTime / 2}ms`
})
const gravityRotate = computed(() => {
  return props.player.gravity === 'down' ? 0 : 180
})
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
      distance.x = 0
    }
    else {
      distance.x = props.gameFieldRECT.width - playerRECT.value.width
    }
  }
}
watch(props, () => {
  setPlayersDistanceAndGravityRotation()
  if(props.gameFieldRECT){
    horizontalMovement.value = props.gameFieldRECT.width / 280
    verticalMovement.value = props.gameFieldRECT.height / 200
  }
})
watch(fail, () => {
  if(fail.value){
    initialFail.value = true
    stopAllHorizontalMovement()
    stopVerticalMovement()
    window.removeEventListener('keydown', moveHorizontally)
    setTimeout(() => {
      initialFail.value = false
      if(props.player.checkpointPosition && props.gameFieldRECT){
        distance.x = props.player.checkpointPosition.x - (window.innerWidth - props.gameFieldRECT.width) / 2
        distance.y = props.player.checkpointPosition.y
        emit('change-gravity-to-checkpoint', props.player)
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
  playerRECT.value = container.value?.getBoundingClientRect()
  window.addEventListener('keydown', moveHorizontally)
  window.addEventListener('keyup', stopOneHorizontalMovement)
  window.addEventListener('blur', stopAllHorizontalMovement)
  window.addEventListener('resize', () => {
    playerRECT.value = container.value?.getBoundingClientRect()
  })
})
</script>

<style lang="scss" scoped>
$pauseTime: v-bind(stylePauseTime);
.respawnBlink {
  animation: respawnBlink $pauseTime;
}

@keyframes respawnBlink {
  0% {
    opacity: 0;
  }
  14% {
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  29% {
    opacity: 1;
  }
  30% {
    opacity: 0;
  }
  44% {
    opacity: 0;
  }
  45% {
    opacity: 1;
  }
  54% {
    opacity: 1;
  }
  55% {
    opacity: 0;
  }
  64% {
    opacity: 0;
  }
  65% {
    opacity: 1;
  }
  74% {
    opacity: 1;
  }
  75% {
    opacity: 0;
  }
  79% {
    opacity: 0;
  }
  80% {
    opacity: 1;
  }
  84% {
    opacity: 1;
  }
  85% {
    opacity: 0;
  }
  89% {
    opacity: 0;
  }
  90% {
    opacity: 1;
  }
  91% {
    opacity: 0;
  }
  92% {
    opacity: 1;
  }
  93% {
    opacity: 0;
  }
  94% {
    opacity: 1;
  }
  95% {
    opacity: 0;
  }
  96% {
    opacity: 1;
  }
  97% {
    opacity: 0;
  }
  98% {
    opacity: 1;
  }
  99% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>