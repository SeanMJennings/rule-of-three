<script lang="ts" setup>
import styles from "./CloseButtonIcon.module.css";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faX} from "@fortawesome/free-solid-svg-icons";

defineProps<{
  the_id?: string
}>();
</script>

<template>
  <button :id="the_id" :class="styles.button">
    <FontAwesomeIcon :id="`${the_id !== '' ? the_id + '-icon' : ''}`" :icon="faX"/>
  </button>
</template>

<style scoped src="@/components/CloseButtonIcon.module.css"></style>
