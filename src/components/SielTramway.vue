<template>
  <main class="screen" :class="{ 'inverted-column': options.invertedColumns }">
    <section class="departures-section">
      <header class="departures-header">
        <Header :line="line" :branchesNames="branchesNames" :viewMode="viewMode" />
      </header>
      <article class="departures" :data-view-mode="viewMode">
        <TimeViewMode v-if="viewMode === 'TIMES'" :departures="departuresBySettings" />
        <DestinationViewMode
          v-else-if="viewMode === 'DESTINATIONS'"
          :departures="departuresBySettings"
        />
        <NoDataAvailable v-else />
      </article>
    </section>
    <DisruptionsPanel class="traffic-info-section" />
  </main>
</template>
<script lang="ts" setup>
import type { Departure, Line } from '@/types'
import Header from './Header.vue'
import { computed } from 'vue'
import TimeViewMode from './TimeViewMode.vue'
import NoDataAvailable from './NoDataAvailable.vue'
import { cleanStopName } from '@/utils'
import DisruptionsPanel from './DisruptionsPanel.vue'
import DestinationViewMode from './DestinationViewMode.vue'
export interface ScreenSettings {
  invertedColumns: boolean
  branches: string[]
}

interface Props {
  line: Line
  departures: Departure[]
  options: ScreenSettings
}
const props = defineProps<Props>()
type VIEW_MODE = 'DESTINATIONS' | 'TIMES' | 'NO_DATA'

const departuresBySettings = computed<Departure[]>(() => {
  return props.departures.filter((d) => props.options.branches.includes(d.branchId))
})

const branchesNames = computed<string[]>(() => {
  const dests = departuresBySettings.value
    .map((dep) => cleanStopName(dep.branchName))
    .filter((name) => name.trim() !== '')
  return Array.from(new Set(dests)).sort()
})

const viewMode = computed<VIEW_MODE>(() => {
  // Si on n'a pas de départs, on affiche NO_DATA
  if (departuresBySettings.value.length === 0) {
    return 'NO_DATA'
  }
  // Si tous les départs n'ont pas le même destination, on affiche NAMES
  const areAllSameDestination = departuresBySettings.value.every(
    //@ts-ignore // On ignore car on sait que departures n'est pas vide ici
    (departure) => departure.destination === departuresBySettings.value[0].destination,
  )
  // Si tous les départs contiennent dans le nom de leur destination le même nom de branche ou l'inverse
  const areAllSameBranchName = departuresBySettings.value.every(
    //@ts-ignore // On ignore car on sait que departures n'est pas vide ici
    (departure): boolean => {
      const depBranchName = cleanStopName(departure.branchName).toLowerCase()
      //@ts-ignore
      const firstDepBranchName = cleanStopName(departuresBySettings.value[0].branchName).toLowerCase()

      const destName = departure.destination.toLowerCase()
      return (
        (depBranchName.includes(firstDepBranchName) || firstDepBranchName.includes(depBranchName)) || destName.includes(firstDepBranchName) || firstDepBranchName.includes(destName)
      )
    }
  )
  console.log({ areAllSameDestination, areAllSameBranchName, departuresBySettings: departuresBySettings.value })
  return areAllSameDestination && areAllSameBranchName ? 'TIMES' : 'DESTINATIONS'
})
</script>
<style scoped lang="scss">
.screen {
  height: 100%;
  width: 100%;
  font-size: 3cqmin;
  container-type: size;
  background-color: black;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75%;
  grid-template-rows: 100%;
  box-sizing: border-box;
  padding: 0.1% 0;
  padding-left: 0.1%;
}

.departures-section {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: 33% 67%;
  grid-template-columns: 100%;

  box-sizing: border-box;
}

.traffic-info-section {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
}
.screen.inverted-column {
  .departures-section {
    order: 2;
  }
  .traffic-info-section {
    order: 1;
  }
}
</style>
