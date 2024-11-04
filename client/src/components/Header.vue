<script lang="ts" setup>
import {RouterLink} from "vue-router";
import styles from "./Header.module.css";
import Login from "@/components/user/Login.vue";
import Logout from "@/components/user/Logout.vue";
import {useAuth0} from "@auth0/auth0-vue";
const auth0 = useAuth0();
</script>

<template>
  <header :class="styles.header">
    <h1>Rule of Three</h1>
    <Login/>
    <Logout/>
    <nav v-if="auth0.isAuthenticated.value" :class="styles.nav">
      <RouterLink to="/tasks">Tasks</RouterLink>
    </nav>
  </header>
</template>

<style scoped src="@/components/Header.module.css"></style>
