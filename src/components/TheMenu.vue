<template>
  <div class="flex flex-col justify-center items-center gap-16 bg-black text-white h-[100vh]">
    <p class="text-5xl md:text-6xl text-center lg:text-7xl">The Gravitron</p>
      <div class="play-options flex flex-col xl:flex-row gap-16 text-xl lg:text-3xl">
        <button v-for="(option, index) in ['singleplayer', 'two player co-op', 'gravity trio']" :key="option" @click="emit('choose-gamemode', index + 1)" class="option">
          <p class="uppercase">
            {{ option }}
          </p>
        </button>
      </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'choose-gamemode', value: number): void
}>()
</script>

<style lang="scss" scoped>

</style>