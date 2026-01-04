<template>
  <div class="disruptions-panel h-w-100">
    <div class="disruptions-icons h-w-100">
      <CurrentDisruption />
      <Clock class="clock" />
    </div>
    <div class="active-disruption-message">
      <div class="message" :class="messageLengthClass" v-html="currentMessage"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import Clock from './Clock.vue'
import CurrentDisruption from './CurrentDisruption.vue'
import { getStringRealLength } from '@/utils'
const currentMessage =
'Attentifs, ensemble • <strong>Signaler à nos agents tout objet abandonné ou situation inhabituelle</strong>'
const messageLengthClass = computed(() => {
  const length = getStringRealLength(currentMessage)
  if (length > 430) {
    return 'too-long-message'
  }
  if (length > 270) {
    return 'very-very-long-message'
  }
  if (length > 200) {
    return 'very-long-message'
  }
  if (length > 120) {
    return 'long-message'
  }
  return ''
})
</script>
<style scoped lang="css">
.disruptions-panel {
  display: grid;
  grid-template-rows: 23% 77%;
  grid-template-columns: 100%;
  border-radius: 2cqh;
}
.disruptions-icons {
  overflow: hidden;
  position: relative;
  background-color: #c2cdda;
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
}

.clock {
  font-family: 'IDFMMedium', sans-serif;
  position: absolute;
  top: 0;
  width: 35cqh;
  right: 3.5cqh;
  box-sizing: border-box;
  color: var(--ratp-yellow);
  background-color: black;
  border-bottom-left-radius: 2cqh;
  border-bottom-right-radius: 2cqh;
  font-size: 12cqh;
  display: flex;
  justify-content: center;
  align-items: center;
}
:deep(strong) {
  font-family: 'IDFMMedium', sans-serif !important;
  font-weight: normal;
}
.active-disruption-message {
  font-size: 11.5cqh;
  letter-spacing: 1;

}
.message {
  font-family: 'IDFMRegular', sans-serif;
  padding: 3.5cqh 4cqh;
  color: #221f21;
}

.long-message {
  font-size: 0.85em;
}
.very-long-message {
  font-size: 0.75em;
}
.very-very-long-message {
  font-size: 0.6em;
}
.too-long-message {
  font-size: 0.45em;
}
</style>
