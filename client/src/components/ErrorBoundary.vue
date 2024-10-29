<script setup lang="ts">
import styles from "./ErrorBoundary.module.css";
import {onErrorCaptured, ref, useSlots} from "vue";
import {DotLottieVue} from "@lottiefiles/dotlottie-vue";

const slots = useSlots();
const hasError = ref(false);

if (!slots.default && !slots.boundary) {
  console.warn("ErrorBoundary component must have child components.");
}

onErrorCaptured(() => {
  hasError.value = true;
  return false;
});
</script>

<template>
  <template v-if="!slots.boundary">
    <slot v-if="!hasError"></slot>
    <main v-else>
      <div :class="styles.container">
        <h2>An unknown error occurred</h2>
        <span>It should be sorted soon</span>
        <DotLottieVue :class="styles.animation" autoplay src="https://lottie.host/5ae2d64f-4e56-43e7-bbc5-0f6706ad2393/F0kkN0kpAb.json" />
      </div>
    </main>
  </template>
</template>

<style scoped src="@/components/ErrorBoundary.module.css"></style>