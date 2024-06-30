<script setup lang="ts">
import { RouterLink } from 'vue-router'
import styles from './Header.module.css'
</script>

<template>
  <header :class=styles.header>
    <h1>Rule of three</h1>
    <nav :class=styles.nav>
      <RouterLink to="/notes">Notes</RouterLink>
    </nav>
  </header>
</template>

<style src="@/components/Header.module.css" scoped></style>
