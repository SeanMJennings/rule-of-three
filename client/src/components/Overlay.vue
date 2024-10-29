<script lang="ts" setup>
import styles from "./Overlay.module.css";
import {faX} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

defineProps<{
  theError: string
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
      <span>{{ (theError !== undefined && theError !== '') ? theError : "The error is unknown" }}</span>
    </div>
  </div>
</template>

<style scoped src="@/components/Overlay.module.css"></style>
