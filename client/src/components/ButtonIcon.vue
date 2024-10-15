<script lang="ts" setup>
import styles from "./ButtonIcon.module.css";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {type IconDefinition} from "@fortawesome/free-solid-svg-icons";
const props = defineProps<{
  disabled?: boolean
  icon: IconDefinition
  style: typeof styles
}>();
</script>

<template>
  <button :disabled="disabled" :class="styles.button">
    <FontAwesomeIcon :class="props.style" :icon="props.icon" />
  </button>
</template>

<style scoped src="@/components/ButtonIcon.module.css"></style>
