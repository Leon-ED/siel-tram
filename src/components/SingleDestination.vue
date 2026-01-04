<template>
  <div class="departure-time h-w-100">
    <div class="destination-name">
      <div v-html="cleanStopName(departure.destination)"></div>
    </div>
    <div class="bar" v-if="departureOrder === 0"></div>
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
import { cleanStopName } from '@/utils'

interface Props {
  departure: Departure
  departureOrder: number
}
defineProps<Props>()
</script>
<style scoped lang="css">
.departure-time {
  display: grid;
  grid-template-columns: 60% 40%;
  grid-auto-rows: 100%;
  position: relative;
}
.destination-name {
  font-family: 'IDFMBold', sans-serif;
  background-color: white;
  color: #4d565f;
  font-size: 11cqh;
  padding: 0 4cqh;
  display: flex;
  align-items: center;
  padding-right: 6cqh;
  white-space: normal;
  word-break: normal;
  overflow-wrap: normal;
  hyphens: none;
}

.bar {
  --offset: 2%;
  content: '';
  position: absolute;
  right: auto;
  top: 100%;
  left: var(--offset);
  z-index: 10;
  height: 2%;
  width: calc(60% - var(--offset) * 2);
  background-color: #4d565f;
  border-radius: 999px;
}
:deep(sup) {
  vertical-align: 40%;
  font-size: 0.6em;
}
</style>
