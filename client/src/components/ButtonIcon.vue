<script lang="ts" setup>
import styles from "./ButtonIcon.module.css";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {type IconDefinition} from "@fortawesome/free-solid-svg-icons";

const props = defineProps<{
  the_id?: string
  disabled?: boolean
  icon: IconDefinition
  iconStyle?: typeof styles
}>();
</script>

<template>
  <button :id="the_id" :class="styles.button" :disabled="disabled">
    <FontAwesomeIcon :id="`${the_id !== '' ? the_id + '-icon' : ''}`" :class="props.iconStyle" :icon="props.icon"/>
  </button>
</template>

<style scoped src="@/components/ButtonIcon.module.css"></style>
