<script lang="ts" setup>
import modalStyles from "./TasksListModal.common.module.css";
import shareModalStyles from "./ShareTasksListModal.module.css";
import type {EventFromLogic, SnapshotFrom} from "xstate";
import {tasksMachine} from "@/state-machines/tasks.state-machine";
import Modal from "@/components/Modal.vue";
import {faAdd} from "@fortawesome/free-solid-svg-icons";
import ButtonIcon from "@/components/ButtonIcon.vue";
import {ref, watch} from "vue";
import {waitUntil} from "@/common/utilities";
import {getSharers, tasksListSharerAreUpdating} from "@/state-machines/tasks.extensions";

const props = defineProps<{
  snapshot: SnapshotFrom<typeof tasksMachine>;
  send: (event: EventFromLogic<typeof tasksMachine>) => void;
  onClose: () => void
}>();

const the_email = ref("");
watch(the_email, (oldValue) => {
  the_email.value = oldValue;
});

const onSubmit = async () => {
  props.send({type: "shareTasksList", id: props.snapshot.context.id, email: the_email.value});
  await waitUntil(() => !tasksListSharerAreUpdating(props.snapshot.value));
  props.onClose();
}

</script>

<template>
  <Modal title="Share tasks list" :on-close="onClose" size="medium">
    <div :class="modalStyles.body">
      <div :class="modalStyles.inputContainer">
        <input id="share-task-list-input" v-model="the_email" :class="modalStyles.input" type="text"/>
        <ButtonIcon the_id="share-task-list-submit" :icon="faAdd" v-on:click="onSubmit" :class="modalStyles.icon" title="Add sharer"/>
      </div>
      <div :class="shareModalStyles.container">
        <span v-for="sharer in getSharers(snapshot.context)" :id="sharer.replace('@', '').replace('.', '')" :key="sharer" :class="shareModalStyles.sharer">{{ sharer }}</span>
      </div>
    </div>
  </Modal>
</template>

<style scoped src="@/components/Modal.module.css"></style>
<style scoped src="@/components/tasks/TasksListModal.common.module.css"></style>
<style scoped src="@/components/tasks/ShareTasksListModal.module.css"></style>
