<script lang="ts" setup>
import styles from "./ButtonIcon.module.css";
import { useAuth0 } from '@auth0/auth0-vue';
const auth0 = useAuth0();
const login = () => {
  auth0.loginWithRedirect();
}
</script>

<template>
  <div v-if="!auth0.isAuthenticated.value">
    <button id="login" @click="login">Log in</button>
  </div>
</template>

<style scoped src="@/components/user/Login.module.css"></style>
