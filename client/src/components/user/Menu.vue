<script lang="ts" setup>
import { useAuth0 } from '@auth0/auth0-vue';
import styles from "@/components/user/Menu.module.css";
import ButtonIcon from "@/components/ButtonIcon.vue";
import {faUser, faX} from "@fortawesome/free-solid-svg-icons";
import {ref} from "vue";
const auth0 = useAuth0();
const logout = () => {
  auth0.logout({
      logoutParams: {
      returnTo: window.location.origin
    }});
}
const menuClosed = ref(true);
const toggleMenu = () => {
  menuClosed.value = !menuClosed.value;
}
</script>

<template>
  <div v-if="auth0.isAuthenticated.value">
    <ButtonIcon the_id="menu-open" v-if="menuClosed" :icon="faUser" :class="styles.menuButton" v-on:click="toggleMenu" title="Open menu"/>
    <ButtonIcon the_id="menu-close" v-if="!menuClosed" :icon="faX" :class="styles.menuButton" v-on:click="toggleMenu" title="Close menu"/>
    <div v-if="!menuClosed" :class="styles.menu">
      <span>{{ auth0.user.value?.name }}</span>
      <button :class="styles.logoutButton" id="logout" @click="logout" title="Logout">Logout</button>
    </div>
  </div>
</template>

<style scoped src="@/components/user/Menu.module.css"></style>
