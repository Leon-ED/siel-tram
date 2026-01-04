<template>
  <div class="icon-container">
    <svg viewBox="0 0 341 193" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 0H234.407C248.358 0 260.977 8.28527 266.523 21.0867L341 193H0V0Z" fill="white" />
      <path
        d="M350.5 193H336.871C330.881 193 325.465 189.436 323.095 183.934L252.522 20.0869C246.977 7.28552 234.358 2.07725e-05 220.407 0H264L277 30L350.5 193Z"
        fill="#c2cdda"
      />
    </svg>
    <img class="main-icon" src="/public/disruptions/info.svg" alt="Icône de perturbation" />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="css">
.icon-container {
  height: 100%;
  width: fit-content;
  position: relative;
}
svg {
  position: absolute;
  height: 100%;
  z-index: 0;
}
.main-icon {
  position: relative;
  display: block;
  z-index: 1;
  padding-top: 1cqh;
  height: 23.5cqh;
}
</style>
