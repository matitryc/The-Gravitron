<template>
  <div>
    <div ref="upper" class="gravity-changer absolute top-[20%] w-full h-[2px] bg-gray-200"></div>
    <div ref="lower" class="gravity-changer absolute bottom-[20%] w-full h-[2px] bg-gray-200">
  </div>
  </div>
 
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { PlayerPosition } from '../types/Player.js'
const props = defineProps<{
  positionedPlayer: PlayerPosition | undefined
}>()
const emit = defineEmits<{
  (e: 'change-gravity', value: number): void
}>()
let isEmitting = false
const upper = ref<HTMLDivElement | undefined>()
const upperRECT = ref<DOMRect | undefined>()
const lower = ref<HTMLDivElement | undefined>()
const lowerRECT = ref<DOMRect | undefined>()
const getRectOfBothElements = (): void => {
  upperRECT.value = upper.value?.getBoundingClientRect()
  lowerRECT.value = lower.value?.getBoundingClientRect()
}
const collides = (changerPosition: DOMRect, changer: HTMLDivElement): boolean => {
  if(props.positionedPlayer && changerPosition){
    const centerOfThePlayer = props.positionedPlayer.position.top + props.positionedPlayer.position.height / 2
    if(changer === upper.value){
      if(changerPosition.top >= centerOfThePlayer){
        return true
      }
    }
    else {
      if(changerPosition.top <= centerOfThePlayer){
        return true
      }
    }
  }
  return false
}
const emitGravityChange = (changer: HTMLDivElement): void => {
  if(props.positionedPlayer){
    if(!isEmitting){
      emit('change-gravity', props.positionedPlayer.id)
      isEmitting = true
      changer.classList.add('opacity-70')
      //let player leave changer so emit doesn't trigger again
      setTimeout(() => {
        isEmitting = false
        changer.classList.remove('opacity-70')
      }, 100)
    }
  }
}
watch(props, () => {
  if(upperRECT.value && lowerRECT.value && upper.value && lower.value){
    const collidesUpper = collides(upperRECT.value, upper.value)
    const collidesLower = collides(lowerRECT.value, lower.value)
    if(collidesUpper){
      emitGravityChange(upper.value)
    }
    else if(collidesLower){
      emitGravityChange(lower.value)
    }
  }
})
onMounted(() => {
  getRectOfBothElements()
  window.addEventListener('resize', getRectOfBothElements)
})
</script>

<style scoped>

</style>