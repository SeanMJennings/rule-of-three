<script lang="ts" setup>
import styles from "./Header.module.css";
import Login from "@/components/user/Login.vue";
import Logout from "@/components/user/Logout.vue";
import {useAuth0} from "@auth0/auth0-vue";
</script>

<template>
  <header :class="styles.header">
    <h1>Rule of Three</h1>
    <Login/>
    <Logout/>
  </header>
</template>

<style scoped src="@/components/Header.module.css"></style>
