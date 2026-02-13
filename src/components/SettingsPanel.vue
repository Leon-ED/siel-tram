<template>
  <div class="settings-panel" id="settings">
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
          {{ stop ? '(' + stop.city + ')' : '' }}
        </span>
      </div>
      <div class="option">
        <div class="info">
          Lien de l'écran
          <span class="info link-status" v-if="copied"> Le lien a été copié !</span>
        </div>

        <textarea
          class="info copyable-link"
          style="width: 100%; font-size: 1em; resize: none"
          rows="4"
          readonly
          @click="copy(currentUrl)"
          >{{ currentUrl }}</textarea
        >
      </div>
    </div>
    <h3 class="title">Paramètres</h3>
    <div class="settings-options">
      <div class="option-checkbox">
        <label for="invert-columns">Informations trafic à gauche</label>
        <input name="invert-columns" type="checkbox" v-model="screenOptions.invertedColumns" />
      </div>
      <div class="option-checkbox">
        <label for="mode">Mode d'affichage</label>
        <select name="mode" v-model="screenOptions.mode">
          <option value="AUTO">Automatique</option>
          <option value="DESTINATIONS">Destinations</option>
          <option value="TIMES">Horaires</option>
        </select>
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
import { useClipboard } from '@vueuse/core'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const currentUrl = computed(() => window.location.origin + route.fullPath)
interface Props {
  line: Line | null
  stop: Stop | null
  screenOptions: ScreenSettings
  branchesAvailable: string[]
}
const { copy, isSupported, copied } = useClipboard()

const props = defineProps<Props>()
</script>
<style scoped lang="css">
.settings-panel {
  font-family: 'GFontRegular', sans-serif;
  display: flex;
  flex-direction: column;
  padding: 2cqh;
  gap: 1cqh;
  padding-bottom: 3%;
  width: fit-content;
}
.title {
  font-size: 2em;
  margin-bottom: 0.5em;
}
.settings-options {
  display: flex;
  flex-direction: column;
  gap: 1em;
}
.option:last-child {
  margin-bottom: 0.5em;
}
.option {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}
.option-checkbox {
  display: flex;
  align-items: center;
  gap: 1em;
}
input[type='checkbox'] {
  width: 1.3em;
  height: 1.3em;
  accent-color: v-bind('line?.color');
}
.label,
label,
.info {
  font-size: 1.3em;
}

.copyable-link {
  font-family: 'GFontRegular', sans-serif;
  cursor: pointer;
  height: auto;
}
.link-status {
  font-family: 'GFontBold', sans-serif;
  margin-left: 1cqh;
  font-size: 0.8em;
  padding: 0.1em 0.4em;
  background-color: rgb(15, 187, 15);
  color: white;
  border-radius: 5px;
}
</style>
