<script lang="ts" setup>
import ErrorModal from "@/components/ErrorModal.vue";
import {ref} from "vue";
const showModal = ref(true);
</script>

<template>
  <div>Test</div>
  <ErrorModal v-if="showModal" :on-close="() => { showModal = false }" code="400" the-error="wobble" />
</template>
