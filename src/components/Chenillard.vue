<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  size: String,
  width: String,
})
const cssProps = computed(() => {
  return {
    ['--size']: props.size,
  }
})
</script>
<template>
  <div class="loader content-centered" :style="cssProps">
    <div style="display: flex">
      <div class="loader__dot" id="dot1"></div>
      <div class="loader__dot" id="dot2"></div>
      <div class="loader__dot" id="dot3"></div>
    </div>
  </div>
</template>
<style scoped>
@keyframes blink {
  0% {
    opacity: 1;
  }

  33.33% {
    opacity: 0.4;
  }

  66.66% {
    opacity: 0.4;
  }

  100% {
    opacity: 1;
  }
}

.loader {
  position: absolute;
  /* center elem */
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* center elem */
}
.loader__dot {
  width: var(--size);
    height: var(--size);
  margin: 0 0.2rem;
  border-radius: 50%; /* transforme en rond */
  animation: blink 600ms infinite;
  background-color: var(--ratp-yellow);
  opacity: 0.3;
}

.loader__dot:nth-child(1) {
  animation-delay: 0s;
}

.loader__dot:nth-child(2) {
  animation-delay: 200ms;
}

.loader__dot:nth-child(3) {
  animation-delay: 450ms;
}
</style>
