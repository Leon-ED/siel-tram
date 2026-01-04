<template>
  <main class="screen" :class="{ 'inverted-column': options.areColumnsInverted }">
    <section class="departures-section">
      <header class="departures-header">
        <Header :line="line" :branchesNames="branchesNames" />
      </header>
      <article class="departures" :data-view-mode="viewMode">
        <TimeViewMode v-if="viewMode === 'TIMES'" :departures="departures" />
        <NameViewMode v-else-if="viewMode === 'NAMES'" />
        <NoDataAvailable v-else />
      </article>
    </section>
    <section class="traffic-info-section"></section>
  </main>
</template>
<script lang="ts" setup>
import type { Departure, Line } from '@/types'
import Header from './Header.vue'
import { computed, ref } from 'vue'
import TimeViewMode from './TimeViewMode.vue'
import NameViewMode from './NameViewMode.vue'
import NoDataAvailable from './NoDataAvailable.vue'
export interface ScreenSettings {
  areColumnsInverted: boolean
}

interface Props {
  line: Line
  departures: Departure[]
  options: ScreenSettings
}
const props = defineProps<Props>()
type VIEW_MODE = 'NAMES' | 'TIMES' | 'NO_DATA'

const branchesNames = computed<string[]>(() => {
  const dests = props.departures.map((dep) => dep.branchName).filter((name) => name.trim() !== "")
  return Array.from(new Set(dests)).sort()
})


const viewMode = computed<VIEW_MODE>(() => {
  /**
   * @TODO : ENLEVER
   */
  return 'TIMES'

  // Si on n'a pas de départs, on affiche NO_DATA
  if (props.departures.length === 0) {
    return 'NO_DATA'
  }
  // Si tous les départs n'ont pas le même destination, on affiche NAMES
  const areAllSameDestination = props.departures.every(
    //@ts-ignore // On ignore car on sait que departures n'est pas vide ici
    (departure) => departure.destination === props.departures[0].destination,
  )
  return areAllSameDestination ? 'TIMES' : 'NAMES'
})
</script>
<style scoped lang="scss">
.screen {
  --gap: 1.5cqh;
  height: 100%;
  width: 100%;
  font-size: 3cqmin;
  container-type: size;
  background-color: black;
  display: grid;
  grid-template-columns: repeat(2, calc(50% - var(--gap) / 2));
  gap: 1.5cqh;
  grid-template-rows: 100%;
  box-sizing: border-box;
  padding: 1.5cqh;
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
  border-radius: 2cqh;
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
