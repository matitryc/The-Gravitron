<template>
  <img ref="doppelganger" :src="`./../../player_${index}.png`" class="doppelganger relative h-[9vh] top-0 left-0 -translate-x-full -translate-y-full opacity-90">
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
const props = defineProps<{
  index: number
  playerPosition: DOMRect | null
  gravityRotate: number
  directionRotate: number
  gameFieldRECT: DOMRect | null
}>()
const emit = defineEmits(['switch'])
const doppelganger = ref<HTMLImageElement | null>(null)
const doppelgangerRECT = ref<DOMRect | null>(null)
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
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
      distanceX = props.gameFieldRECT.width - (window.innerWidth - props.gameFieldRECT.width) / 2 + props.playerPosition.x + props.playerPosition.width / 2
    }
    else {
      distanceX = props.playerPosition.x - props.gameFieldRECT.width + props.playerPosition.width / 2 - (window.innerWidth - props.gameFieldRECT.width) / 2
    }
    doppelganger.value.style.transform = `
      translate(Calc(-50% + ${distanceX}px), ${props.playerPosition.y - props.playerPosition.height}px) 
      rotateX(${props.gravityRotate}deg) 
      rotateY(${props.directionRotate}deg)
    `
  }
})
onMounted(() => {
  if(doppelganger.value){
    doppelgangerRECT.value = doppelganger.value.getBoundingClientRect()
    observer.observe(doppelganger.value)
  }
})
</script>

<style lang="scss" scoped>

</style>