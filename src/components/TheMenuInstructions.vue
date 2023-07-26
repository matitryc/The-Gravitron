<template>
   <div class="flex flex-col items-center justify-center">
      <p class="flex flex-col gap-8 text-center text-xl lg:text-2xl max-w-screen-lg">
        <span>
          Your job is to avoid obstacles while changing gravity for a fixed amount of time.
        </span>
        <span class="text-red-100">
          Every fail counts and the sum will be displayed at the end.
        </span>
        <span>
          The obstacles generate dynamically, meaning every time your gaming experience will be different!
        </span>
        <span class="text-base lg:text-lg">
          (Also, you warp when going max to the left or the right. Please, check it out. (It's cool, I promise.))
        </span>
      </p>
      <p class="text-2xl lg:text-3xl uppercase mt-16">controls</p>
      <div class="flex flex-col md:flex-row gap-8 text-center text-lg lg:text-xl mt-8">
        <div class="flex flex-col flex-grow basis-0">
          <p class="uppercase text-xl lg:text-2xl mb-4">player one</p>
          <p>left: A</p>
          <p>right: D</p>
        </div>
        <div class="flex flex-col flex-grow basis-0">
          <p class="uppercase text-xl lg:text-2xl mb-4">player two</p>
          <p>left: LEFT ARROW</p>
          <p>right: RIGHT ARROW</p>
        </div>
         <div class="flex flex-col flex-grow basis-0">
          <p class="uppercase text-xl lg:text-2xl mb-4">player three</p>
          <p>left: J</p>
          <p>right: L</p>
        </div>
      </div>
      <button @click="emit('instructions-read')" class="bg-white text-black text-2xl lg:text-3xl uppercase py-4 px-8 mt-8">
        got it
      </button>
    </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'instructions-read'): void
}>()
</script>

<style lang="scss" scoped>

</style>