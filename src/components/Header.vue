<template>
  <div class="header" :class="{['view-mode-'+viewMode.toLowerCase()]: true }">
    <LineLogo :line="line" size="21cqh" class-name="logo" />
    <div class="directions">
      <h1 class="direction" :class="directionLenghtClass" v-if="branchesNames.length > 0" v-html="branchesNames.join(' • ')"
      </h1>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { Line } from '@/types'
import LineLogo from './LineLogo.vue'
import { computed } from 'vue'
import { getStringRealLength } from '@/utils'
interface Props {
  line: Line
  branchesNames: string[]
  viewMode: string
}
const props = defineProps<Props>()

const directionLenghtClass = computed(() => {
  const length = getStringRealLength(props.branchesNames.join(' • '))
  if (length > 130) {
    return 'why-is-this-soooo-long'
  }
  if (length > 50) {
    return 'very-long-direction'
  }
  if (length > 20) {
    return 'long-direction'
  }

  return ''
})
</script>
<style scoped lang="css">
.header {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background-color: white;
  border-bottom: 6cqh solid v-bind('line.color');
  border-radius: 2cqh;
  padding: 0 3.5cqh;

  display: flex;
  align-items: center;
  gap: 4cqh;
}
.view-mode-destinations{
  border-bottom-left-radius: 0;
}
.directions {
  color: #221f21;
  flex: 1;
  overflow: hidden;
  align-self: center;
  max-height: 100%;
}

.direction {
  font-family: 'IDFMMedium', sans-serif;
  font-size: 15cqh;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  white-space: normal;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}
.long-direction {
  font-size: 11cqh;
  white-space: normal;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}
.very-long-direction {
  font-size: 7cqh;
  white-space: normal;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
}
.why-is-this-soooo-long {
  font-size: 5cqh;
  white-space: normal;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
  line-clamp: 5;
}
:deep(sup) {
  vertical-align: 60%;
  font-size: 0.5em;
}
</style>
