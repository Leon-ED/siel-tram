<template>
  <div class="content">
    <FitBox :ratio="'32/9'" :position="'TOP'">
      <SielTramway v-if="line" :line="line" :departures="departures" :options="screenOptions" />
    </FitBox>
  </div>
  <SettingsPanel :screenOptions="screenOptions" :branchesAvailable="branchesAvailable" :stop="stop" :line="line" />
</template>
<script lang="ts" setup>
import { LineService } from '@/services/lineService'
import { StopService } from '@/services/stopService'
import { type Stop, type Line, type Departure } from '@/types'
import { cleanAndStripId, getSingleValueFromQueryParam, queryParamToArray } from '@/utils'
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FitBox from '../components/FitBox.vue'
import SielTramway, { type ScreenSettings } from '@/components/SielTramway.vue'
import SettingsPanel from '@/components/SettingsPanel.vue'
import { DepartureService } from '@/services/departureService'
import { useIntervalFn } from '@vueuse/core'

const FETCH_DEPARTURES_INTERVAL_SECONDS = 30
const FETCH_DISRUPTIONS_INTERVAL_SECONDS = 120
const APP_FORCE_RELOAD_DELAY_HOURS = 6

const route = useRoute()
const router = useRouter()

const lineId = getSingleValueFromQueryParam(route.query.line, 'string', 'null')
const stopId = getSingleValueFromQueryParam(route.query.stop, 'string', 'null')

const line = ref<Line | null>(null)
const stop = ref<Stop | null>(null)

const departures = ref<Departure[]>([])

/**
 * Force reload de l'application toutes les n heures pour prendre en compte les éventuelles mises à jour
 */
setTimeout(
  () => {
    window.location.reload()
  },
  APP_FORCE_RELOAD_DELAY_HOURS * 60 * 60 * 1_000,
)
const DEFAULT_BRANCHES = ['Aller', 'Retour']
const branchesAvailable = computed<string[]>(() => {
  const dests = departures.value.map((dep) => dep.branchId).filter((name) => name.trim() !== '')
  return Array.from(new Set([...DEFAULT_BRANCHES, ...dests])).sort()
})

const screenOptions = reactive<ScreenSettings>({
  invertedColumns: getSingleValueFromQueryParam(route.query.invertColumns, 'boolean', false),
  branches: (() => {
    const urlBranches = queryParamToArray(route.query.branches)
    if (urlBranches.length === 0) {
      return DEFAULT_BRANCHES
    }
    console.log(urlBranches)
    return Array.from(new Set([ ...urlBranches]))
  })(),
  mode: getSingleValueFromQueryParam(route.query.mode, 'string', 'AUTO') as
    | 'DESTINATIONS'
    | 'TIMES'
    | 'AUTO',
})
watch(
  screenOptions,
  (newOptions) => {
    const nextQuery: Record<string, any> = { ...route.query }
    for (const [key, value] of Object.entries(newOptions)) {
      if (typeof value === 'boolean') {
        nextQuery[key] = String(value)
      } else {
        nextQuery[key] = value
      }
    }
    router.replace({ query: nextQuery })
  },
  { deep: true },
)

if (!lineId || !stopId || lineId.trim() === '' || stopId.trim() === '') {
  router.replace({ name: 'Error' })
  throw new Error('Missing line or stop parameter')
}
/**
 * Gère le rafraîchissement des perturbations
 * TODO: à faire
 */
useIntervalFn(() => {}, FETCH_DISRUPTIONS_INTERVAL_SECONDS * 1_000)
/**
 * Gère le rafraîchissement des départs
 */
useIntervalFn(() => {
  DepartureService.getDepartures(stopId!, lineId!, departures.value).then((fetchedDepartures) => {
    departures.value = fetchedDepartures
  })
}, FETCH_DEPARTURES_INTERVAL_SECONDS * 1_000)

LineService.getLine(cleanAndStripId(lineId)).then((fetchedLine) => {
  line.value = fetchedLine
})
StopService.getStop(cleanAndStripId(stopId)).then((fetchedStop) => {
  stop.value = fetchedStop
})
DepartureService.getDepartures(cleanAndStripId(stopId), cleanAndStripId(lineId), departures.value).then((fetchedDepartures) => {
  departures.value = fetchedDepartures
})
</script>
<style scoped lang="css">
.content {
  background-color: #221f21;
}
</style>
