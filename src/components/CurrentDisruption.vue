<template>
  <div class="icon-container">
    <svg viewBox="0 0 341 193" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 0H234.407C248.358 0 260.977 8.28527 266.523 21.0867L341 193H0V0Z" fill="white" />
      <path
        d="M350.5 193H336.871C330.881 193 325.465 189.436 323.095 183.934L252.522 20.0869C246.977 7.28552 234.358 2.07725e-05 220.407 0H264L277 30L350.5 193Z"
        fill="#c2cdda"
      />
    </svg>
    <div class="content-container">
      <LineLogo :line="disruption.line" class="line-logo" class-name="absolute-logo" :size="disruption.line.id === 'LEONGP_FAKE_ID' ?'25cqh' : '18cqh'" />
      <img
        class="disruption-icon"
        :src="DisruptionService.getIconForImpact(disruption.impact)"
        alt="Icône de perturbation"
        v-if="disruption.line.id !== 'LEONGP_FAKE_ID'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { DisruptionService } from '@/services/disruptionService'
import type { Disruption } from '@/types'
import LineLogo from './LineLogo.vue'

interface Props {
  disruption: Disruption
}
defineProps<Props>()
</script>

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
.content-container {
  position: relative;
  z-index: 2;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.line-logo {
  margin-top: -1.5cqh;
  margin-left: 2.5cqh;
}
.disruption-icon {
  height: 11cqh;
  width: auto;
  margin-left: -3cqh;
  margin-top: 9cqh;
}
</style>
