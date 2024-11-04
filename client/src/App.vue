<script lang="ts" setup>
import {RouterView} from "vue-router";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import ErrorBoundary from "@/components/ErrorBoundary.vue";
</script>

<template>
  <Header/>
  <main>
    <ErrorBoundary>
      <RouterView/>
    </ErrorBoundary>
  </main>
  <Footer/>
</template>
