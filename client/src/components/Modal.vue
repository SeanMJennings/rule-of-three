<script lang="ts" setup>
import styles from "./Modal.module.css";
import CloseButtonIcon from "@/components/CloseButtonIcon.vue";
import {onMounted, onUnmounted, useSlots} from "vue";

useSlots();
const props = defineProps<{
  onClose: () => void,
  title: string
  size: 'small' | 'medium'
}>();



const listener = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    props.onClose();
  }
}

onMounted(() => {
  document.addEventListener('keydown', listener);
})

onUnmounted(() => {
  document.removeEventListener('keydown', listener);
})
</script>

<template>
  <div :class="styles.background" />
  <div :class="props.size === 'small' ? styles.smallOverlay : styles.mediumOverlay" id="overlay" aria-modal="true">
    <div :class="styles.header">
      <h2 :class="styles.title">{{ props.title }}</h2>
      <CloseButtonIcon tabindex="0" id="overlay-close" v-on:click="onClose" title="close"/>
    </div>
    <slot/>
  </div>
</template>

<style scoped src="@/components/Modal.module.css"></style>
