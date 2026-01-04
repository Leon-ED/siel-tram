<template>
  <div class="disruptions-panel h-w-100">
    <div class="disruptions-icons h-w-100">
      <CurrentDisruption :disruption="activeDisruption" />
      <Clock class="clock" />
    </div>
    <div class="active-disruption-message">
      <div class="message" :class="messageLengthClass" v-html="activeDisruption.description"></div>
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
  line: DEFAULT_DISUPTION_LINE,
}
;('')
const DISRUPTION_SHOW_DURATION_SECONDS = 2

const activeIndex = ref(0)
const activeDisruption = computed<Disruption>(() => {
  const disruptions = props.disruptions

  if (!disruptions || disruptions.length === 0) {
    return DEFAULT_DISRUPTION
  }
  return disruptions[activeIndex.value] ?? DEFAULT_DISRUPTION
})
const { pause, resume } = useIntervalFn(
  () => {
    if (!props.disruptions || props.disruptions.length <= 1) return

    activeIndex.value = (activeIndex.value + 1) % props.disruptions.length
  },
  DISRUPTION_SHOW_DURATION_SECONDS * 1000,
  { immediateCallback: false,immediate: true },
)
watch(
  () => props.disruptions,
  (newDisruptions) => {
    activeIndex.value = 0

    if (!newDisruptions || newDisruptions.length <= 1) {
      pause()
    } else {
      resume()
    }
  },
  { immediate: true },
)

const messageLengthClass = computed(() => {
  const length = getStringRealLength(activeDisruption.value.description)
  if (length > 430) {
    return 'too-long-message'
  }
  if (length > 270) {
    return 'very-very-long-message'
  }
  if (length > 200) {
    return 'very-long-message'
  }
  if (length > 120) {
    return 'long-message'
  }
  return ''
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
  font-size: 11.5cqh;
  letter-spacing: 1;
}
.message {
  font-family: 'IDFMRegular', sans-serif;
  padding: 3.5cqh 4cqh;
  color: #221f21;
}

.long-message {
  font-size: 0.85em;
}
.very-long-message {
  font-size: 0.75em;
}
.very-very-long-message {
  font-size: 0.6em;
}
.too-long-message {
  font-size: 0.45em;
}
</style>
