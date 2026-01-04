<template>
  <div class="icon-container">
    <svg viewBox="0 0 306 193" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.4768 27.494C-3.83639 14.3473 5.83993 0 20.0197 0H222.005C230.093 0 237.384 4.87067 240.481 12.3417L303.901 165.342C309.359 178.511 299.681 193 285.425 193H81.8539C73.7018 193 66.3656 188.052 63.311 180.494L1.4768 27.494Z"
        fill="#f2f2f2"
      />
    </svg>
    <div class="content-container">
      <LineLogo
        :line="disruption.line"
        class="line-logo"
        class-name="absolute-logo"
        :size="disruption.line.id === 'LEONGP_FAKE_ID' ? '10cqh' : '8cqh'"
      />
      <img
        class="disruption-icon"
        :src="DisruptionService.getIconForImpact(disruption.impact)"
        alt="Icône de perturbation"
        v-if="disruption.line.id !== 'LEONGP_FAKE_ID'"
      />
    </div>
  </div>
</template>
<style scoped lang="scss">
svg {
  position: absolute;
  height: 100%;
  z-index: 0;
}
.icon-container {
  height: 100%;
  width: fit-content;
  position: relative;
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
  margin-top: -1cqh;
  margin-left: 5cqh;
}
.disruption-icon {
  height: 4cqh;
  width: auto;
  margin-left: -1cqh;
  margin-top: 7cqh;
}
</style>

<script setup lang="ts">
import { DisruptionService } from '@/services/disruptionService'
import type { Disruption } from '@/types'
import LineLogo from './LineLogo.vue'

interface Props {
  disruption: Disruption
}
defineProps<Props>()
</script>

