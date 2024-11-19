<script lang="ts" setup>
import styles from "./Header.module.css";
import Login from "@/components/user/Login.vue";
import Menu from "@/components/user/Menu.vue";
import {RouterLink} from "vue-router";
</script>

<template>
  <header :class="styles.header">
    <RouterLink id="landing-link" to="/"><h1>Rule of Three</h1></RouterLink>
    <Login/>
    <Menu/>
  </header>
</template>

<style scoped src="@/components/Header.module.css"></style>
