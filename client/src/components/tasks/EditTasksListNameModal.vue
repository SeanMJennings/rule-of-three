﻿<script lang="ts" setup>
import editStyles from "./TasksListModal.common.module.css";
import {faSave} from "@fortawesome/free-solid-svg-icons";
import {ref, watch} from "vue";
import ButtonIcon from "@/components/ButtonIcon.vue";
import commonStyle from "@/components/tasks/Tasks.common.module.css";
import type {EventFromLogic, SnapshotFrom} from "xstate";
import {tasksMachine} from "@/state-machines/tasks.state-machine";
import {waitUntil} from "@/common/utilities";
import {tasksListNamingIsUpdating} from "@/state-machines/tasks.extensions";
import Modal from "@/components/Modal.vue";

const props = defineProps<{
  name: string
  snapshot: SnapshotFrom<typeof tasksMachine>;
  send: (event: EventFromLogic<typeof tasksMachine>) => void;
  onClose: () => void
}>();
const the_name = ref(props.name);
watch(the_name, (oldValue) => {
  the_name.value = oldValue.slice(0, 50);
});

const onSubmit = async () => {
  props.send({type: "updateTasksList", id: props.snapshot.context.id, name: the_name.value});
  await waitUntil(() => !tasksListNamingIsUpdating(props.snapshot.value));
  props.onClose();
}

</script>

<template>
  <Modal title="Edit tasks list name" :on-close="onClose" size="small">
    <div :class="editStyles.body">
      <div :class="editStyles.inputContainer">
        <input id="edit-task-list-name-input" v-model="the_name" :class="editStyles.input" type="text"/>
        <ButtonIcon the_id="edit-task-list-name-submit" :icon="faSave" v-on:click="onSubmit" :class="editStyles.icon" title="Save edit"/>
      </div>
      <span id="edit-task-list-name-character-count" :class="commonStyle.characterCount">{{the_name.length > 0 ? the_name.length + "/50" : "" }}</span>
    </div>
  </Modal>
</template>

<style scoped src="@/components/Modal.module.css"></style>
<style scoped src="@/components/tasks/TasksListModal.common.module.css"></style>
