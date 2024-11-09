<script lang="ts" setup>
import {RouterView} from "vue-router";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import ErrorBoundary from "@/components/ErrorBoundary.vue";
import {useAuth0} from "@auth0/auth0-vue";
import {watch} from "vue";
const auth0 = useAuth0();

watch(auth0.idTokenClaims, () => {
  window.token = auth0.idTokenClaims.value?.__raw
})

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
