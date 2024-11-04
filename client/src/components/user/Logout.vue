<script lang="ts" setup>
import styles from "./ButtonIcon.module.css";
import { useAuth0 } from '@auth0/auth0-vue';
const auth0 = useAuth0();
const logout = () => {
  auth0.logout({
      logoutParams: {
      returnTo: window.location.origin
    }});
}
</script>

<template>
  <div v-if="auth0.isAuthenticated.value">
    <button id="logout" @click="logout">Log out</button>
  </div>
</template>

<style scoped src="@/components/user/Logout.module.css"></style>
