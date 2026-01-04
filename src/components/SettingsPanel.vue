<template>
  <div class="settings-panel">
    <h3 class="title">Informations</h3>
    <div class="settings-options">
      <div class="option">
        <span class="info"
          >Ligne actuelle :
          <strong>{{ line ? line.name : 'Information Indisponible' }} </strong>
        </span>
      </div>
      <div class="option">
        <span class="info">
          Arrêt actuel :
          <strong>{{ stop ? stop.name : 'Information Indisponible' }}</strong>
          {{ stop ? '('+stop.city+')' : '' }}
        </span>
      </div>
    </div>
    <h3 class="title">Paramètres</h3>
    <div class="settings-options">
      <div class="option-checkbox">
        <label for="invert-columns">Informations trafic à gauche</label>
        <input name="invert-columns" type="checkbox" v-model="screenOptions.invertedColumns" />
      </div>

      <div class="option">
        <label for="selected-branch">Branches à afficher</label>
        <select name="selected-branch" v-model="screenOptions.branches" multiple="true">
          <option v-for="branch in branchesAvailable" :key="branch" :value="branch">
            {{ branch }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Line, Stop } from '@/types'
import type { ScreenSettings } from './SielTramway.vue'

interface Props {
  line: Line | null
  stop: Stop | null
  screenOptions: ScreenSettings
  branchesAvailable: string[]
}

const props = defineProps<Props>()
</script>
<style scoped lang="css">
.settings-panel {
  font-family: 'GFontRegular', sans-serif;
  display: flex;
  flex-direction: column;
  padding: 2cqh;
  gap: 1cqh;
  padding-bottom: 4cqh;
  width: fit-content;
}
.title {
  font-size: 3cqh;
  margin-bottom: 1cqh;
}
.settings-options {
  display: flex;
  flex-direction: column;
  gap: 2cqh;
}
.option:last-child {
  margin-bottom: 2cqh;
}
.option {
  display: flex;
  flex-direction: column;
  gap: 1cqh;
}
.option-checkbox {
  display: flex;
  align-items: center;
  gap: 2cqh;
}
input[type='checkbox'] {
  width: 2.5cqh;
  height: 2.5cqh;
  accent-color: v-bind('line?.color');
}
.label,
label {
  font-size: 2.5cqh;
}
.info {
  font-size: 2.2cqh;
}
</style>
