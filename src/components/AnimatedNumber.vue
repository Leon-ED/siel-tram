<script setup lang="ts">
import { ref, toRefs, watch } from 'vue'

const props = defineProps<{
  time: string
}>()

const { time } = toRefs(props)

const element = ref<HTMLElement>()
const displayTime = ref(time.value)

const animateChange = async () => {
  if (!element.value) return
  await element.value.animate([{opacity: 1}, { opacity: 0 }], {
    duration: 1000,
    easing: 'ease-out',
    fill: 'forwards',
  }).finished
  displayTime.value = time.value
  await element.value.animate([{opacity: 0}, { opacity: 1 }], {
    duration: 1000,
    easing: 'ease-in-out',
    fill: 'forwards',
  }).finished

}
watch(time, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    console.log('Animating change for AnimatedNumber from', oldVal, 'to', newVal)
    animateChange()
  }
})
</script>

<template>
    <div ref="element">{{ displayTime }}</div>
</template>
