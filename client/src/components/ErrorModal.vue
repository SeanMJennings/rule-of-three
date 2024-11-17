<script lang="ts" setup>
import styles from "./Modal.module.css";
import {DotLottieVue} from "@lottiefiles/dotlottie-vue";
import Modal from "@/components/Modal.vue";

defineProps<{
  theError: string | undefined,
  code: number | undefined,
  onClose: () => void
}>();

</script>

<template>
  <Modal title="An error occurred" :on-close="onClose" size="medium">
    <div :class="styles.body">
      <span>{{ (theError !== undefined && theError !== '' && !code?.toString()?.startsWith('5')) ? theError : "The error is unknown" }}</span>
      <br />
      <span>It should be sorted soon</span>
      <DotLottieVue :class="styles.animation" autoplay src="https://lottie.host/5ae2d64f-4e56-43e7-bbc5-0f6706ad2393/F0kkN0kpAb.json" />
    </div>
  </Modal>
</template>

<style scoped src="@/components/Modal.module.css"></style>
