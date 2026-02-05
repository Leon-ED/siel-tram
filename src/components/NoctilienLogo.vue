<template>
  <svg
    width="3500"
    height="1939"
    class="idfm-style"
    viewBox="0 0 3500 1939"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :style="style"
  >
    <g clip-path="url(#clip0_30_53)">
      <rect width="3500" height="1939" fill="#0A0082" class="rectangle" />
      <rect y="1700" width="3500" height="300" :fill="bgColor" />
      <text
        fill="white"
        :letter-spacing="-10"
        :font-size="getFontSize(realLineName.length)"
      >
        <tspan x="50%" y="1400">{{ realLineName }}</tspan>
      </text>
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  lineName: string
  height: string
  baseFontSize?: string
  bgColor: string
  textColor: string
}

const props = withDefaults(defineProps<Props>(), {
  baseFontSize: '7800',
})

const getFontSize = (length: number): number => {
  if (length <= 4) {
    return 1400
  }
  return 800
}

const realLineName = computed(() => {
  return props.lineName
})

const style = computed(() => ({
  '--height': props.height,
}))
</script>

<style scoped>
svg {
  display: block;
  height: var(--height);
  width: auto;
  font-family: 'ParisineBold';
}
svg.idfm-style {
  font-family: 'IDFMMedium' !important;
  border-radius: .5vw !important;

}
/* align text */
text {
  text-anchor: middle;
  x: 50%;
}
:deep(.upcoming-disruptions) svg.idfm-style {
   border-radius: 15.5cqw !important;

}
</style>
