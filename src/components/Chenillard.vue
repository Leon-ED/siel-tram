<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
    size: String,
    color: String,
    width: String,
})
const cssProps = computed(() => {
    return {
        fill: props.color,
        fontSize: props.size,
        width: props.width
    }
})


</script>
<template>
    <div class="loader content-centered " :style="cssProps">
        <div class="loader__dots">
            <div class="loader__dot" id="dot1">.</div>
            <div class="loader__dot" id="dot2">.</div>
            <div class="loader__dot" id="dot3">.</div>
        </div>
    </div>
</template>
<style scoped>

@keyframes blink {
    0% {
        opacity: 1;
    }

    33.33% {
        opacity: 0.4;
    }

    66.66% {
        opacity: 0.4;
    }

    100% {
        opacity: 1;
    }
}
.loader__dots{
    display: flex;
    
}

.loader{
    position: absolute;
    /* center elem */
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    /* center elem */
    color: var(--ratp-yellow);

}
.loader__dot {
    animation: 600ms blink infinite;
    opacity: 0.3;
}

.loader__dot:nth-child(1) {
    animation-delay: 0s;
}

.loader__dot:nth-child(2) {
    animation-delay: 200ms;
}

.loader__dot:nth-child(3) {
    animation-delay: 450ms;
}
</style>