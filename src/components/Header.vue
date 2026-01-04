<template>
  <div class="header">
    <LineLogo :line="line" size="21cqh" class-name="logo" />
    <div class="directions">
      <h1 class="direction" :class="directionLenghtClass" v-if="branchesNames.length > 0">
        {{ branchesNames.join(' • ') }}
      </h1>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { Line } from '@/types'
import LineLogo from './LineLogo.vue'
import { computed } from 'vue'
interface Props {
  line: Line
  branchesNames: string[]
}
const props = defineProps<Props>()

const directionLenghtClass = computed(() => {
  if (props.branchesNames.join(' • ').length > 130) {
    return 'why-is-this-soooo-long'
  }
  if (props.branchesNames.join(' • ').length > 30) {
    return 'very-long-direction'
  }
  if (props.branchesNames.join(' • ').length > 20) {
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
.directions {
  flex: 1;
  overflow: hidden;
  align-self: center;
  max-height: 100%;
}

.direction {
  font-family: 'IDFMBold', sans-serif;
  font-size: 15cqh;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.long-direction {
  font-size: 10cqh;
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
</style>
