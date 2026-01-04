<script setup lang="ts">
import ErrorImage from '@/components/ErrorImage.vue'
import { useRoute } from 'vue-router';
const route = useRoute();
const errorId = route.query.error || 'uk';
const errorMessageMap: Record<string, string> = {
  'mp': "ERROR MISSING PARAMETERS 'line' and/or 'stop' in URL",
  'uk': 'Unknown error occurred',
};


</script>

<template>
  <div class="content">
    <h1
    style="position: absolute; top: 10%; color: white; text-align: center; width: 100%; font-size: min(3vw,10vh);"
    > {{ errorMessageMap[errorId as string] || errorMessageMap['uk'] }}
  </h1>
    <div class="img">
      <ErrorImage class="image" />
    </div>
  </div>
</template>
<style scoped>
.content {
  background-color: #221f21;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.img {
  height: 70%;
}
</style>
