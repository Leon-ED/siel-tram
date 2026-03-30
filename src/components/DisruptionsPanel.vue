<template>
  <div class="disruptions-panel h-w-100">
    <div class="disruptions-icons h-w-100">
      <CurrentDisruption :disruption="activeDisruption" class="active-disruption-icon" />
      <TransitionGroup name="list" tag="div" class="upcoming-disruptions">
        <UpcompingDisruption
          class="upcoming-disruption"
          v-for="disruption in upcomingDisruptions"
          :key="disruption.id"
          :disruption="disruption"
        />
      </TransitionGroup>

      <Clock class="clock" />
    </div>
    <div class="active-disruption-message">
      <Transition name="slide-horizontal">
        <div
          v-if="disruptionSvgSrc === null"
          :key="'text-' + activeDisruption.id"
          class="message"
          :class="messageLengthClass"
          v-html="activeDisruption.description"
        />

        <div v-else :key="'svg-' + activeDisruption.id" class="image-container">
          <img
            :src="disruptionSvgSrc"
            :alt="activeDisruption.title + ' - ' + activeDisruption.description"
            class="disruption-svg"
          />
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Clock from './Clock.vue'
import CurrentDisruption from './CurrentDisruption.vue'
import { getStringRealLength } from '@/utils'
import { Mode, type Disruption, type Line } from '@/types'
import { useIntervalFn } from '@vueuse/core'
import UpcompingDisruption from './UpcompingDisruption.vue'

interface Props {
  disruptions: Disruption[]
}

const props = defineProps<Props>()

const DEFAULT_DISUPTION_LINE: Line = {
  id: 'LEONGP_FAKE_ID',
  name: 'Toutes les lignes',
  color: '#000000',
  textColor: '#FFFFFF',
  mode: Mode.AUTRE,
}

const DEFAULT_DISRUPTION: Disruption = {
  id: 'default',
  title: 'Vigilence',
  description:
    'Attentifs, ensemble • <strong>Signaler à nos agents tout objet abandonné ou situation inhabituelle</strong>',
  status: 'ACTIVE',
  impact: 'INFO',
  hasSvg: false,
  line: DEFAULT_DISUPTION_LINE,
}

const DISRUPTION_SHOW_DURATION_SECONDS = 15
const activeIndex = ref(0)

const activeDisruption = computed<Disruption>(() => {
  return uniqueDisruptions.value[activeIndex.value] ?? DEFAULT_DISRUPTION
})
const uniqueDisruptions = computed<Disruption[]>(() => {
  const list = props.disruptions || []
  if (list.length === 0) return [DEFAULT_DISRUPTION]

  const seenGenericLines = new Set<string>()

  return list.filter((disruption) => {
    const displaysGeneric =
      disruption.description.toLowerCase().includes('travaux') &&
      getStringRealLength(disruption.description) >= 120

    if (displaysGeneric) {
      const lineId = disruption.line.id
      if (seenGenericLines.has(lineId)) {
        return false
      }
      seenGenericLines.add(lineId)
    }

    return true
  })
})

const { pause, resume } = useIntervalFn(
  () => {
    if (uniqueDisruptions.value.length <= 1) return
    activeIndex.value = (activeIndex.value + 1) % uniqueDisruptions.value.length
  },
  DISRUPTION_SHOW_DURATION_SECONDS * 1000,
  { immediateCallback: false, immediate: true },
)

watch(
  uniqueDisruptions,
  (newList) => {
    activeIndex.value = 0
    if (newList.length <= 1) {
      pause()
    } else {
      resume()
    }
  },
  { immediate: true },
)

const messageLengthClass = computed(() => {
  const length = getStringRealLength(activeDisruption.value.description)
  if (length > 270) return 'very-very-long-message'
  if (length > 200) return 'very-long-message'
  if (length > 120) return 'long-message'
  return ''
})
const shouldDisplayGenericWorksMessage = computed(() => {
  return (
    activeDisruption.value.description.toLowerCase().includes('travaux') &&
    getStringRealLength(activeDisruption.value.description) >= 120
  )
})
const disruptionSvgSrc = computed(() => {
  if (!activeDisruption.value.hasSvg && !shouldDisplayGenericWorksMessage.value) {
    return null
  }
  if (activeDisruption.value.hasSvg) {
    return `/disruptions/models/${activeDisruption.value.id}.svg`
  }
  if (shouldDisplayGenericWorksMessage.value) {
    if (activeDisruption.value.status === 'ACTIVE') {
      return '/disruptions/models/ongoingworks.svg'
    }
    if (activeDisruption.value.status === 'PLANNED') {
      return '/disruptions/models/upcomingworks.svg'
    }
  }
  return null
})

const upcomingDisruptions = computed(() => {
  return uniqueDisruptions.value.slice(activeIndex.value + 1, activeIndex.value + 6)
})
</script>

<style scoped lang="css">
.disruptions-panel {
  display: grid;
  grid-template-rows: 23% 77%;
  grid-template-columns: 100%;
  border-radius: 2cqh;
}

.disruptions-icons {
  overflow: hidden;
  position: relative;
  background-color: #c2cdda;
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
  display: grid;
  grid-template-rows: 100%;
  grid-template-columns: 23% 77%;
}

.upcoming-disruptions {
  height: 100%;
  width: 100%;
  margin-top: 2cqh;
  display: grid;
  grid-template-columns: repeat(5, 12%);
  align-items: center;
  gap: 2cqh;
}

.upcoming-disruption {
  aspect-ratio: 1;
  height: 55%;
}

.clock {
  font-family: 'IDFMMedium', sans-serif;
  position: absolute;
  top: 0;
  width: 35cqh;
  right: 3.5cqh;
  box-sizing: border-box;
  color: var(--ratp-yellow);
  background-color: black;
  border-bottom-left-radius: 2cqh;
  border-bottom-right-radius: 2cqh;
  font-size: 12cqh;
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(strong) {
  font-family: 'IDFMMedium', sans-serif !important;
  font-weight: normal;
}

.active-disruption-message {
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 11.5cqh;
  letter-spacing: 1;
}

.message,
.image-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.message {
  font-family: 'IDFMRegular', sans-serif;
  padding: 3.5cqh 4cqh;
  color: #221f21;
}

.disruption-svg {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.long-message {
  font-size: 0.85em;
}
.very-long-message {
  font-size: 0.775em;
}
.very-very-long-message {
  font-size: 0.6em;
}
.too-long-message {
  font-size: 0.45em;
}

.active-disruption-icon {
  z-index: 1;
}

.slide-horizontal-enter-active,
.slide-horizontal-leave-active {
  transition:
    transform 1.2s ease,
    opacity 1.2s ease;
}

.slide-horizontal-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-horizontal-enter-to {
  transform: translateX(0);
  opacity: 1;
}

.slide-horizontal-leave-from {
  transform: translateX(0);
  opacity: 1;
}

.slide-horizontal-leave-to {
  transform: translateX(-90%);
  opacity: 0;
}

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 1s ease;
}

.list-leave-active {
  position: absolute;
  top: 31.5%;
  transform: translateX(-300px);
}

.list-enter-from {
  opacity: 0;
  transform: translateX(150px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(-100px);
}
</style>
