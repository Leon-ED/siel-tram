<template>
  <div class="departure-times h-w-100">
    <ol class="departure-times-list h-w-100">
      <li v-for="(departure,index) in departures.slice(0,2)" :id="departure.id" :key="departure.id" class="departure-time-item h-w-100">
        <SingleDestination :departure="departure" :departure-order="index" />
      </li>
    </ol>
  </div>
</template>
<script setup lang="ts">
import type { Departure } from '@/types'
import SingleDestination from './SingleDestination.vue';

interface Props {
  departures: Departure[]
}
defineProps<Props>()
</script>
<style scoped lang="css">
.departure-times-list {
  display: grid;
  grid-template-rows: 50% 50%;
  grid-auto-columns: 100%;
}
</style>
