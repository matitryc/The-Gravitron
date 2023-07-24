<template>
  <img ref="indicator" src="/../../triangle.svg" class="indicator" alt="">
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Obstacle } from '../types/Obstacle.js'
defineProps<{
  obstacle: Obstacle
}>()
const indicator = ref<HTMLImageElement | null>(null)
onMounted(() => {
  if(indicator.value){
    indicator.value.classList.add('move')
  }
})
</script>

<style lang="scss" scoped>
.move {
  animation: move .5s;
}
@keyframes move {
  0% {
    transform: translateX(0)
  }
  30% {
    transform: translateX(1rem)
  }
  60% {
    transform: translateX(0)
  }
  100% {
    transform: translateX(0)
  }
}
</style>