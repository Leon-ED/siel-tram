<template>
  <div class="departure h-w-100" :data-index="departureOrder">
    <div class="vehicle-order">{{ departureOrder + 1 }}<sup>e</sup> tram</div>
    <div class="departure-time-before-arrival">
      <div class="time-info" v-if="showMinutes">
        <span class="minutes">{{ getMinutesFromDate(departure.time) }}</span>
        <span class="unit">min</span>
      </div>
      <span v-if="departure.isAtStop" class="at-platform-text">à quai</span>
    </div>
    <span class="bar" v-if="departureOrder === 0"></span>
  </div>
</template>
<script setup lang="ts">
import type { Departure } from '@/types'
import { getMinutesFromDate, getSecondesFromDate } from '@/utils'
import { computed, ref, toRefs } from 'vue'

interface Props {
  departure: Departure
  departureOrder: number
}
const NEGATIVE_THRESHOLD_SECONDS = -30

const props = defineProps<Props>()
const { departure, departureOrder } = toRefs(props)

const secondsBeforeArrival = ref<number>(getSecondesFromDate(departure.value.time))

/**
 * Sert à savoir s'il faut afficher les trois points jaunes ...
 */
const isTimeNotReliable = computed<boolean>(() => {
  return secondsBeforeArrival.value < NEGATIVE_THRESHOLD_SECONDS
})
const showMinutes = computed<boolean>(() => {
  return isTimeNotReliable.value === false && !departure.value.isAtStop
})
</script>
<style scoped lang="css">
.departure {
  box-sizing: border-box;
  padding-top: 1.5cqh;
  padding-left: 4cqh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}
.vehicle-order {
  position: absolute;
  left: 5cqh;
  top: 1cqh;
  color: white;
  font-size: 7.5cqh;
}
.departure-time-before-arrival {
  margin-top: 10cqh;
  color: var(--ratp-yellow);
  display: flex;
  align-items: baseline;
  justify-content: center;
}
.minutes {
  font-family: 'IDFMBold', 'ParisineBold', sans-serif;
  font-size: 50cqh;
}
.unit {
  font-family: 'IDFMRegular', sans-serif;
  font-size: 10cqh;
  opacity: 0.7;
}
.at-platform-text {
  font-family: 'IDFMBold', sans-serif;
  font-size: 20cqh;
}
.bar {
  --offset: 7%;
  content: '';
  position: absolute;
  top: var(--offset);
  right: -1%;
  width: 0.85%;
  background-color: #fff;
  border-radius: 999px;
  height: calc(100% - var(--offset) * 2);
}
</style>
