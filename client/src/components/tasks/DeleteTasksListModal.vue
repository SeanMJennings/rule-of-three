<script lang="ts" setup>
import styles from "../Modal.module.css";
import modalStyles from "./TasksListModal.common.module.css";
import {faX} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import type {EventFromLogic, SnapshotFrom} from "xstate";
import {tasksMachine} from "@/state-machines/tasks.state-machine";
import {waitUntil} from "@/common/utilities";
import {tasksListIsBeingDeleted} from "@/state-machines/tasks.extensions";

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
  <div :class="styles.background" />
  <div :class="modalStyles.overlay" id="delete-task-list-modal">
    <div :class="styles.header">
      <h2 :class="styles.title">Delete Tasks List</h2>
      <FontAwesomeIcon id="delete-task-list-modal-close" :class="styles.icon" :icon="faX" v-on:click="onClose"/>
    </div>
    <div :class="modalStyles.body">
      <div :class="modalStyles.inputContainer">
        <span>Are you sure you want to delete the tasks list?</span>
        <button id="delete-task-list-submit" :class="modalStyles.button" v-on:click="onSubmit">Yes</button>
      </div>
    </div>
  </div>
</template>

<style scoped src="@/components/Modal.module.css"></style>
<style scoped src="@/components/tasks/TasksListModal.common.module.css"></style>
