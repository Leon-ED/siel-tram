<template>
  <div class="header">
    <LineLogo :line="line" size="19cqh" class-name="logo" />
    <div class="directions">
    <h1 class="direction" v-if="direction">{{ direction }}</h1>

    </div>
  </div>
</template>
<script lang="ts" setup>
import type { Line } from '@/types'
import LineLogo from './LineLogo.vue'
interface Props {
  line: Line
  direction: string | null
}
const props = defineProps<Props>()
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
}

.direction {
  font-family: 'IDFMBold', sans-serif;
  font-size: 15cqh;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
