<template>
  <div
    class="departure h-w-100"
    :data-index="departureOrder"
    :style="{ '--base-font-size': baseFontSize || '5cqh' }"
  >
    <div class="vehicle-order">
      {{ departureOrder + 1
      }}<sup>
        <template v-if="departureOrder === 0">er</template>
        <template v-else>e</template>
      </sup>
      tram
    </div>
    <div class="departure-time-before-arrival">
      <div class="time-info" v-if="showMinutes">
        <AnimatedNumber :time="Math.round(secondsBeforeArrival / 60).toString()" class="minutes" />
        <span class="unit">min</span>
      </div>
      <span v-if="departure.isAtStop" class="at-platform-text">à quai</span>
    </div>
    <span class="bar" v-if="departureOrder === 0"></span>
    <Chenillard class="time-is-unreliable" size="1.5em" v-if="isTimeNotReliable" />
  </div>
</template>
<script setup lang="ts">
import type { Departure } from '@/types'
import { getSecondesFromDate } from '@/utils'
import { useNow } from '@vueuse/core'
import { computed, toRefs } from 'vue'
import Chenillard from './Chenillard.vue'
import AnimatedNumber from './AnimatedNumber.vue'

interface Props {
  departure: Departure
  departureOrder: number
  baseFontSize?: string
}
const NEGATIVE_THRESHOLD_SECONDS = -30

const props = defineProps<Props>()
const { departure, departureOrder, baseFontSize } = toRefs(props)

const now = useNow({ interval: 4_000 })

const secondsBeforeArrival = computed(() => {
  const _tick = now.value

  return getSecondesFromDate(departure.value.time, true, _tick.getTime())
})

/**
 * Sert à savoir s'il faut afficher les trois points jaunes ...
 */
const isTimeNotReliable = computed<boolean>(() => {
  return secondsBeforeArrival.value < NEGATIVE_THRESHOLD_SECONDS && !departure.value.isAtStop
})
const showMinutes = computed<boolean>(() => {
  return isTimeNotReliable.value === false && !departure.value.isAtStop
})
</script>
<style scoped lang="scss">
.departure {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  position: relative;
  font-size: var(--base-font-size);
}
.vehicle-order {
  margin-left: 5cqh;
  margin-top: 3cqh;
  top: 3cqh;
  color: white;
  font-size: 1.5em;
}
.departure-time-before-arrival {
  top: 16%;
  position: absolute;
  width: 100%;
  color: var(--ratp-yellow);
  display: flex;
  align-items: center;
  justify-content: center;
}
.time-info {
  width: 100%;
  box-sizing: border-box;
  padding-right: 4cqh;
  height: 100%;
  display: grid;
  grid-template-columns: 75% 25%;
  grid-template-rows: 100%;
  justify-items: center;
  align-items: baseline;
}
sup {
  vertical-align: 40%;
  font-size: 0.65em;
}
.minutes {
  font-family: 'IDFMBold', 'ParisineBold', sans-serif;
  font-size: 10em;
  justify-self: end;
}
.unit {
  font-family: 'IDFMRegular', sans-serif;
  font-size: 2em;
  opacity: 0.7;
  justify-self: start;
}
.at-platform-text {
  font-family: 'IDFMBold', sans-serif;
  font-size: 4em;
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
.time-is-unreliable {
  margin-top: 8cqh;
}

.horizontal-position {
  .time-is-unreliable {
    --size: 2em !important;
  }
  .vehicle-order {
    display: none;
  }
  .departure-time-before-arrival {
    top: 5%;
  }
  .time-info {
    width: 100%;
    grid-template-columns: 60% 40%;
    padding-right: 0;
  }
  .minutes {
    justify-self: center;
  }
  .unit {
    font-size: 2.8em;
  }
  .bar {
    right: auto;
    top: 100%;
    left: var(--offset);
    height: 2%;
    width: calc(100% - var(--offset) * 2);
  }
}
</style>
