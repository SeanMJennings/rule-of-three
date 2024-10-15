<script lang="ts" setup>
import {RouterLink} from "vue-router";
import styles from "./Header.module.css";
</script>

<template>
  <header :class="styles.header">
    <h1>Rule of three</h1>
    <nav :class="styles.nav">
      <RouterLink to="/tasks">Tasks</RouterLink>
    </nav>
  </header>
</template>

<style scoped src="@/components/Header.module.css"></style>
