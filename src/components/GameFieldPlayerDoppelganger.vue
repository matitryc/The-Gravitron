<template>
  <img ref="doppelganger" class="doppelganger absolute h-[9vh] -translate-x-full -translate-y-full opacity-90">
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
const props = defineProps<{
  index: number
  playerPosition: DOMRect | undefined
  gravityRotate: number
  directionRotate: number
  gameFieldRECT: DOMRect | undefined
}>()
const emit = defineEmits<{
  (e: 'switch'): void
}>()
const doppelganger = ref<HTMLImageElement | undefined>()
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting && doppelganger.value){
      emit('switch')
    }
  })
}, {
  root: document.querySelector('.game-field'),
  rootMargin: '0px',
  threshold: 1
})
watch(props, () => {
  if(doppelganger.value && props.playerPosition && props.gameFieldRECT){
    let distanceX: number
    if(props.playerPosition.x <= window.innerWidth / 2){
      distanceX = props.gameFieldRECT.width - (window.innerWidth - props.gameFieldRECT.width) / 2 + props.playerPosition.x
    }
    else {
      distanceX = props.playerPosition.x - props.gameFieldRECT.width - (window.innerWidth - props.gameFieldRECT.width) / 2
    }
    doppelganger.value.style.transform = `
      translate(${distanceX}px, ${props.playerPosition.y}px) 
      rotateX(${props.gravityRotate}deg) 
      rotateY(${props.directionRotate}deg)
    `
  }
})
onMounted(() => {
  if(doppelganger.value){
    observer.observe(doppelganger.value)
  }
})
</script>
