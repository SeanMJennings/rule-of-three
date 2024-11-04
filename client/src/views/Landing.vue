<script lang="ts" setup>
import style from "./Landing.module.css";
import {RouterLink} from "vue-router";
import {useAuth0} from "@auth0/auth0-vue";
const auth0 = useAuth0();
</script>

<template>
    <div :class="style.container">
      <h1>A simple approach</h1>
      <h1>to doing</h1>
      <h1>or accepting</h1>
      <br/>
      <span>Carry a task for up to three pages of 22 lines or forget it</span>
      <RouterLink id="tasks-link" :class="style.link" v-if="auth0.isAuthenticated.value" to="/tasks">Go to Tasks</RouterLink>
    </div>
</template>
