<script lang="ts" setup>
import styles from "@/components/user/Login.common.module.css";
import { useAuth0 } from '@auth0/auth0-vue';
const auth0 = useAuth0();
const login = () => {
  auth0.loginWithPopup().then(() => {
    window.token = auth0.idTokenClaims.value?.__raw
  })
}
</script>

<template>
  <div v-if="!auth0.isAuthenticated.value">
    <button :class="styles.button" id="login" @click="login">Log in</button>
  </div>
</template>

<style scoped src="@/components/user/Login.common.module.css"></style>
