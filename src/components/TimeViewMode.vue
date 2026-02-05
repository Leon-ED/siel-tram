<template>
  <div class="departure-times h-w-100">
    <ol class="departure-times-list h-w-100">
      <li v-for="(departure, index) in departures.slice(0,1)" :id="departure.id" :key="departure.id" class="departure-time-item h-w-100">
        <SingleTime :departure="departure" :departure-order="index" />
      </li>
      <li v-if="departures.length === 1" class="departure-time-item h-w-100">
        <SingleTime :departure="FAKE_DEPARTURE" :departure-order="1" />
      </li>
    </ol>
  </div>
</template>
<script setup lang="ts">
import type { Departure } from '@/types'
import SingleTime from './SingleTime.vue'

interface Props {
  departures: Departure[]
}
const FAKE_DEPARTURE: Departure = {
  id: 'fake',
  time: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
  isAtStop: false,
  branchId: 'fake',
  lineId: 'fake',
  branchName: 'fake',
  destination: 'fake',
  platform: 'fake',
}

defineProps<Props>()
</script>
<style scoped lang="css">
.departure-times-list {
  display: grid;
  grid-template-columns: 50% 50%;
  grid-auto-rows: 100%;
}
</style>
