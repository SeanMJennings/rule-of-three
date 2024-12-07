<script lang="ts" setup>
import modalStyles from "./TasksListModal.common.module.css";
import type {EventFromLogic, SnapshotFrom} from "xstate";
import {tasksMachine} from "@/state-machines/tasks.state-machine";
import Modal from "@/components/Modal.vue";
import {waitUntil} from "@/common/utilities";
import {tasksListSharerIsUpdating} from "@/state-machines/tasks.extensions";

const props = defineProps<{
  snapshot: SnapshotFrom<typeof tasksMachine>;
  send: (event: EventFromLogic<typeof tasksMachine>) => void;
  onClose: () => void
}>();


const onSubmit = async () => {
  props.send({type: "unshareTasksListForSelf", id: props.snapshot.context.id});
  await waitUntil(() => !tasksListSharerIsUpdating(props.snapshot.value));
  props.onClose();
}

</script>

<template>
  <Modal title="Unshare tasks list" :on-close="onClose" size="small">
    <div :class="modalStyles.body">
      <div :class="modalStyles.inputContainer">
        <span>Are you sure you want to unshare yourself?</span>
        <button id="unshare-self-submit" :class="modalStyles.button" v-on:click="onSubmit" title="Confirm unshare">Yes</button>
      </div>
    </div>
  </Modal>
</template>

<style scoped src="@/components/Modal.module.css"></style>
<style scoped src="@/components/tasks/TasksListModal.common.module.css"></style>
