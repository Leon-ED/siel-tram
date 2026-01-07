<template>
  <div class="departure-time h-w-100">
    <div class="destination-name">
      <div class="destination-name-text" :class="destinationNameLenghtClass"
       v-html="cleanStopName(departure.destination,false).replace(/-/g, '‑')"></div>
    </div>
    <div class="bar" v-if="departureOrder === 1"></div>
    <SingleTime
      :departure="departure"
      :departure-order="departureOrder"
      base-font-size="3cqh"
      class="horizontal-position"
    />
  </div>
</template>
<script setup lang="ts">
import type { Departure } from '@/types'
import SingleTime from './SingleTime.vue'
import { cleanStopName, getStringRealLength } from '@/utils'
import { computed } from 'vue'

interface Props {
  departure: Departure
  departureOrder: number
}
const {departure } = defineProps<Props>()
const destinationNameLenghtClass = computed(() => {
  const length = getStringRealLength(departure.destination)
  if(length > 60){
    return 'very-long-destination'
  }
  if(length > 30){
    return 'long-destination'
  }
  return ''
})

</script>
<style scoped lang="css">
.departure-time {
  display: grid;
  grid-template-columns: 65% 35%;
  grid-auto-rows: 100%;
  position: relative;
}
.destination-name {
  font-family: 'IDFMBold', sans-serif;
  background-color: white;
  color: #4d565f;
  font-size: 11cqh;
  letter-spacing: 0.15cqh;
  padding: 0 4cqh;
  display: flex;
  align-items: center;
  padding-right: 12cqh;
  white-space: normal;
  word-break: normal;
  overflow-wrap: normal;
  hyphens: none;
}
.long-destination {
  font-size: .9em;
}
.very-long-destination {
  font-size: .75em;
}
.destination-name-text {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}
.bar {
  --offset: 2%;
  content: '';
  position: absolute;
  right: auto;
  bottom: 100%;
  left: var(--offset);
  z-index: 10;
  height: 2%;
  width: calc(60% - var(--offset) * 2);
  background-color: #798692a4;
  border-radius: 999px;
}
:deep(sup) {
  vertical-align: 40%;
  font-size: 0.6em;
}
</style>
