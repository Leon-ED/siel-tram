<template>
  <div class="content">
    <FitBox :ratio="'32/9'" :position="'TOP'">
      <SielTramway v-if="line" :line="line" :departures="departures" :options="screenOptions" :disruptions="disruptions" />
    </FitBox>
  </div>
  <SettingsPanel
    :screenOptions="screenOptions"
    :branchesAvailable="branchesAvailable"
    :stop="stop"
    :line="line"
  />
</template>
<script lang="ts" setup>
import { LineService } from '@/services/lineService'
import { StopService } from '@/services/stopService'
import { type Stop, type Line, type Departure, type Disruption } from '@/types'
import { cleanAndStripId, getSingleValueFromQueryParam, queryParamToArray } from '@/utils'
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FitBox from '../components/FitBox.vue'
import SielTramway, { type ScreenSettings } from '@/components/SielTramway.vue'
import SettingsPanel from '@/components/SettingsPanel.vue'
import { DepartureService } from '@/services/departureService'
import { useDocumentVisibility, useIntervalFn } from '@vueuse/core'
import { LogService } from '@/services/logService'
import { DisruptionService } from '@/services/disruptionService'

const FETCH_DEPARTURES_INTERVAL_SECONDS = 30
const FETCH_DISRUPTIONS_INTERVAL_SECONDS = 120
const APP_FORCE_RELOAD_DELAY_HOURS = 6

/**
 * Date de la dernière mise à jour des données de départs
 */
const LAST_DEPARTURES_UPDATE = ref<Date | null>(null)
const LAST_DISRUPTIONS_UPDATE = ref<Date | null>(null)
const visibility = useDocumentVisibility();

watch(visibility, (newVisibility) => {
  console.info('Visibility changed to', newVisibility);
  if (newVisibility !== 'visible') {
    return;
  }
  // Si la date de la dernière mise à jour des départs est nulle ou trop ancienne, on force une mise à jour
  const now = new Date();
  if (
    !LAST_DEPARTURES_UPDATE.value ||
    (now.getTime() - LAST_DEPARTURES_UPDATE.value.getTime()) / 1000 >
      FETCH_DEPARTURES_INTERVAL_SECONDS
  ) {
    LAST_DEPARTURES_UPDATE.value = now;
    DepartureService.getDepartures(stopId!, lineId!, departures.value).then((fetchedDepartures) => {
      departures.value = fetchedDepartures;
    });
  }
  // Si la date de la dernière mise à jour des perturbations est nulle ou trop ancienne, on force une mise à jour
  if (
    !LAST_DISRUPTIONS_UPDATE.value ||
    (now.getTime() - LAST_DISRUPTIONS_UPDATE.value.getTime()) / 1000 >
      FETCH_DISRUPTIONS_INTERVAL_SECONDS
  ) {
    LAST_DISRUPTIONS_UPDATE.value = now;
    if (line.value) {
      DisruptionService.getDisruptions([line.value]).then((_disruptions) => {
        disruptions.value = _disruptions;
      });
    }
  }
})

const route = useRoute()
const router = useRouter()

const lineId = getSingleValueFromQueryParam(route.query.line, 'string', 'null')
const stopId = getSingleValueFromQueryParam(route.query.stop, 'string', 'null')
const isEmbedded =
  getSingleValueFromQueryParam(route.query.embed, 'string', '') !== '' ? true : false

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
    return Array.from(new Set([...urlBranches]))
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
LogService.logScreenSelection(
  lineId,
  stopId,
  Boolean(isEmbedded),
  route.query.source ? route.query.source.toString() : null,
)
const disruptions = ref<Disruption[]>([])
useIntervalFn(() => {
  if (!line.value || visibility.value === 'hidden') {
    return
  }
  DisruptionService.getDisruptions([line.value]).then((_disruptions) => {
    disruptions.value = _disruptions
    LAST_DISRUPTIONS_UPDATE.value = new Date();
  })
}, FETCH_DISRUPTIONS_INTERVAL_SECONDS * 1_000)
/**
 * Gère le rafraîchissement des départs
 */
useIntervalFn(() => {
  if (visibility.value === 'hidden') {
    return
  }
  DepartureService.getDepartures(stopId!, lineId!, departures.value).then((fetchedDepartures) => {
    departures.value = fetchedDepartures
    LAST_DEPARTURES_UPDATE.value = new Date();
  })
}, FETCH_DEPARTURES_INTERVAL_SECONDS * 1_000)

LineService.getLine(cleanAndStripId(lineId)).then((fetchedLine) => {
  line.value = fetchedLine
  if (!fetchedLine) {
    return
  }
  DisruptionService.getDisruptions([fetchedLine]).then((_disruptions) => {
    disruptions.value = _disruptions
  })
})
StopService.getStop(cleanAndStripId(stopId)).then((fetchedStop) => {
  stop.value = fetchedStop
})
DepartureService.getDepartures(
  cleanAndStripId(stopId),
  cleanAndStripId(lineId),
  departures.value,
).then((fetchedDepartures) => {
  departures.value = fetchedDepartures
})
</script>
<style scoped lang="css">
.content {
  background-color: #221f21;
}
</style>
