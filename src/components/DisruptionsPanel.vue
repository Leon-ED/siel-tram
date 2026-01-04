<template>
  <div class="disruptions-panel h-w-100">
    <div class="disruptions-icons h-w-100">
      <CurrentDisruption />
      <Clock class="clock" />
    </div>
    <div class="active-disruption-message">
      <div class="message">
        Attentifs, ensemble •
        <strong>Signaler à nos agents tout objet abandonné ou situation inhabituelle</strong>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Clock from './Clock.vue'
import CurrentDisruption from './CurrentDisruption.vue'
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

  padding: 0 2%;
  height: 70%;
  top: 0;
  right: 3.5cqh;
  box-sizing: border-box;
  color: var(--ratp-yellow);
  background-color: black;
  border-bottom-left-radius: 2cqh;
  border-bottom-right-radius: 2cqh;
  font-size: 12cqh;
}
strong {
  font-family: 'IDFMMedium', sans-serif;
}
.message {
  font-family: 'IDFMRegular', sans-serif;
  padding: 3.5cqh 4cqh;
  font-size: 11.5cqh;
  color: #221f21;
}
</style>
