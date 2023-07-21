<template>
  <div class="absolute w-full h-full bg-white">
    <div class="background h-full"></div>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.background {
  background-image: url('./../../zigzag.svg');
  background-repeat: repeat;
  animation: move 10s linear infinite;
}
@keyframes move {
  from {
    background-position: 0
  }
  to {
    background-position: 100vw
  }
}
</style>