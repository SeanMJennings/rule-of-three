<script lang="ts" setup>
import styles from "./Footer.module.css";
import GitHubIcon from './GitHubIcon.vue'
</script>

<template>
  <footer :class="styles.Footer">
    <GitHubIcon url="https://github.com/SeanMJennings/RuleOfThree"/>
  </footer>
</template>

<style scoped src="@/components/Footer.module.css"></style>
