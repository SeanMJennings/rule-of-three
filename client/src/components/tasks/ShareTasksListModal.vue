<script lang="ts" setup>
import modalStyles from "./TasksListModal.common.module.css";
import type {EventFromLogic, SnapshotFrom} from "xstate";
import {tasksMachine} from "@/state-machines/tasks.state-machine";
import Modal from "@/components/Modal.vue";

const props = defineProps<{
  snapshot: SnapshotFrom<typeof tasksMachine>;
  send: (event: EventFromLogic<typeof tasksMachine>) => void;
  onClose: () => void
}>();


</script>

<template>
  <Modal title="Share tasks list" :on-close="onClose" size="small">
    <div :class="modalStyles.body">
      <div :class="modalStyles.inputContainer">
      </div>
    </div>
  </Modal>
</template>

<style scoped src="@/components/Modal.module.css"></style>
<style scoped src="@/components/tasks/TasksListModal.common.module.css"></style>
