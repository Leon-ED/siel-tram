<template>
  <div class="no-departures-available">
    <h2 class="message">{{ message }}</h2>
  </div>
</template>
<script lang="ts" setup>
defineProps<{ message: string }>()
</script>
<style scoped lang="css">
.no-departures-available {
  height: 100%;
  width: 100%;
  display: flex;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 0 2cqh;
}
.message {
  font-family: 'IDFMBold', sans-serif;
  font-size: 12cqh;
  color: var(--ratp-yellow);
  text-align: center;
}
</style>
