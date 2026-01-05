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
      <Transition name="icon-slide">
        <div class="logo-wrapper" :key="disruption.id">
          <LineLogo
            :line="disruption.line"
            class="line-logo"
            class-name="absolute-logo"
            :size="lineLogoSize"
          />

          <img
            class="disruption-icon blink"
            :src="DisruptionService.getIconForImpact(disruption.impact)"
            alt="Icône de perturbation"
            v-if="disruption.line.id !== 'LEONGP_FAKE_ID'"
          />
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DisruptionService } from '@/services/disruptionService'
import { Mode, type Disruption } from '@/types'
import LineLogo from './LineLogo.vue'
import { computed } from 'vue'

interface Props {
  disruption: Disruption
}
const { disruption } = defineProps<Props>()

const lineLogoSize = computed(() => {
  if (disruption.line.id === 'LEONGP_FAKE_ID') {
    return '25cqh'
  }
  const smallerLogosModes = [Mode.BUS, Mode.AUTRE, Mode.NOCTILIEN]
  if (smallerLogosModes.includes(disruption.line.mode)) {
    return '14cqh'
  }
  return '18cqh'
})
</script>

<style scoped lang="css">
.icon-container {
  height: 100%;
  width: fit-content;
  position: relative;
  /* Pas d'overflow hidden ici sinon on coupe l'ombre portée ou le svg si besoin */
}

svg {
  position: absolute;
  height: 100%;
  z-index: 0;
  top: 0;
  left: 0;
}

.content-container {
  position: relative;
  z-index: 2;
  height: 100%;
  width: 115%; /* S'assure de prendre la largeur définie par le parent/SVG */
  /* CRUCIAL : Overflow hidden ici pour que l'icône qui sort ne dépasse pas du trapèze */
  overflow: hidden;
}

/* Nouveau wrapper pour gérer le flexbox de positionnement */
.logo-wrapper {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.line-logo {
  margin-top: -1.5cqh;
  margin-left: 2.5cqh;
  /* S'assure que le logo ne se déforme pas pendant l'anim */
  flex-shrink: 0;
}

.disruption-icon {
  height: 11cqh;
  width: auto;
  margin-left: -2cqh;
  margin-top: 10cqh;
}

/* === ANIMATION (Slide vers la gauche) === */

.icon-slide-enter-active,
.icon-slide-leave-active {
  transition:
    transform 1s ease-out,
    opacity 1s ease-out;
}

/* Pendant le départ, on le sort du flux pour que le nouveau prenne sa place exacte */
.icon-slide-leave-active {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%; /* Force la largeur pour garder le centrage flex */
}

/* Le nouveau arrive de la droite */
.icon-slide-enter-from {
  transform: translateX(120%);
  opacity: 0;
}

/* L'ancien part à gauche */
.icon-slide-leave-to {
  transform: translateX(-120%);
}
</style>
