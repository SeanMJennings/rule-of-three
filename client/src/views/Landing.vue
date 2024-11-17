<script lang="ts" setup>
import style from "./Landing.module.css";
import {RouterLink} from "vue-router";
import {useAuth0} from "@auth0/auth0-vue";
const auth0 = useAuth0();
</script>

<template>
    <div :class="style.container">
      <h2>A simple approach</h2>
      <h2>to doing</h2>
      <h2>or accepting</h2>
      <br/>
      <span>1. Add up to 22 tasks to a list</span>
      <span>2. Carry or remove tasks that were not ticked off</span>
      <span>3. After two carries, tick or remove old tasks</span>
      <div :class="style.linkContainer">
        <RouterLink id="tasks-link" :class="style.link" v-show="auth0.isAuthenticated.value" to="/tasks">Go to Tasks</RouterLink>
      </div>
    </div>
</template>
