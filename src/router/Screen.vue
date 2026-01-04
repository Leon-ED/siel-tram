<template>
  <div class="content">
    <FitBox :ratio="'32/9'">
      <SielTramway v-if="line" :line="line" :departures="departures" :options="screenOptions" />
    </FitBox>
  </div>
  <div class="settings-panel">
    <label for="invert-columns">Inverser l'ordre des colonnes</label>
    <input name="invert-columns" type="checkbox" v-model="screenOptions.areColumnsInverted" />
  </div>
</template>
<script lang="ts" setup>
import { LineService } from '@/services/lineService'
import { StopService } from '@/services/stopService'
import { type Stop, type Line, type Departure } from '@/types'
import { getSingleValueFromQueryParam } from '@/utils'
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FitBox from '../components/FitBox.vue'
import SielTramway, { type ScreenSettings } from '@/components/SielTramway.vue'
import { DepartureService } from '@/services/departureService'

const route = useRoute()
const router = useRouter()

const lineId = getSingleValueFromQueryParam(route.query.line, 'string', 'null')
const stopId = getSingleValueFromQueryParam(route.query.stop, 'string', 'null')

const screenOptions = reactive<ScreenSettings>({
  areColumnsInverted: getSingleValueFromQueryParam(route.query.invertColumns, 'boolean', false),
})
if (!lineId || !stopId || lineId.trim() === '' || stopId.trim() === '') {
  router.replace({ name: 'Error' })
  throw new Error('Missing line or stop parameter')
}
const line = ref<Line | null>(null)
const stop = ref<Stop | null>(null)

const departures = ref<Departure[]>([])

LineService.getLine(lineId).then((fetchedLine) => {
  line.value = fetchedLine
})
StopService.getStop(stopId).then((fetchedStop) => {
  stop.value = fetchedStop
})
DepartureService.getDepartures(stopId, lineId, departures.value).then((fetchedDepartures) => {
  departures.value = fetchedDepartures
})
</script>
<style scoped lang="css">
.content {
  background-color: #836f6f;
}
</style>
