<script lang="ts" setup>
import { useAuth0 } from '@auth0/auth0-vue';
import styles from "@/components/user/Login.common.module.css";
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
    <button :class="styles.button" id="logout" @click="logout">Log out</button>
  </div>
</template>

<style scoped src="@/components/user/Login.common.module.css"></style>
