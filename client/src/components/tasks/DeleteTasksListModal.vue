<script lang="ts" setup>
import modalStyles from "./TasksListModal.common.module.css";
import type {EventFromLogic, SnapshotFrom} from "xstate";
import {tasksMachine} from "@/state-machines/tasks.state-machine";
import {waitUntil} from "@/common/utilities";
import {tasksListIsBeingDeleted} from "@/state-machines/tasks.extensions";
import Modal from "@/components/Modal.vue";

const props = defineProps<{
  snapshot: SnapshotFrom<typeof tasksMachine>;
  send: (event: EventFromLogic<typeof tasksMachine>) => void;
  onClose: () => void
}>();

const onSubmit = async () => {
  props.send({type: "deleteTasksList", id: props.snapshot.context.id});
  await waitUntil(() => !tasksListIsBeingDeleted(props.snapshot.value));
  props.onClose();
}

</script>

<template>
  <Modal title="Delete tasks list" :on-close="onClose" size="small">
    <div :class="modalStyles.body">
      <div :class="modalStyles.inputContainer">
        <span>Are you sure you want to delete the tasks list?</span>
        <button id="delete-task-list-submit" :class="modalStyles.button" v-on:click="onSubmit" title="Confirm delete">Yes</button>
      </div>
    </div>
  </Modal>
</template>

<style scoped src="@/components/Modal.module.css"></style>
<style scoped src="@/components/tasks/TasksListModal.common.module.css"></style>
