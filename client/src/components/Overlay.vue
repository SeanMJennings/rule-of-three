<script lang="ts" setup>
import styles from "./Overlay.module.css";
import {faX} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {DotLottieVue} from "@lottiefiles/dotlottie-vue";

defineProps<{
  theError: string,
  code: number,
  onClose: () => void
}>();
</script>

<template>
  <div :class="styles.background" />
  <div :class="styles.overlay" id="error-overlay">
    <div :class="styles.header">
      <h2 :class="styles.title">An error occurred</h2>
      <FontAwesomeIcon id="error-overlay-close" :class="styles.icon" :icon="faX" v-on:click="onClose"/>
    </div>
    <div :class="styles.body">
      <span>{{ (theError !== undefined && theError !== '' && code === 422) ? theError : "The error is unknown" }}</span>
      <span>It should be sorted soon</span>
      <DotLottieVue :class="styles.animation" autoplay src="https://lottie.host/5ae2d64f-4e56-43e7-bbc5-0f6706ad2393/F0kkN0kpAb.json" />
    </div>
  </div>
</template>

<style scoped src="@/components/Overlay.module.css"></style>
