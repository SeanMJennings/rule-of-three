<script lang="ts" setup>
import modalStyles from "./TasksListModal.common.module.css";
import shareModalStyles from "./ShareTasksListModal.module.css";
import type {EventFromLogic, SnapshotFrom} from "xstate";
import {tasksMachine} from "@/state-machines/tasks.state-machine";
import Modal from "@/components/Modal.vue";
import {faAdd, faMinus} from "@fortawesome/free-solid-svg-icons";
import ButtonIcon from "@/components/ButtonIcon.vue";
import {ref, watch} from "vue";
import {waitUntil} from "@/common/utilities";
import {getSharers, sharerExists, tasksListSharerAreUpdating} from "@/state-machines/tasks.extensions";

const props = defineProps<{
  snapshot: SnapshotFrom<typeof tasksMachine>;
  send: (event: EventFromLogic<typeof tasksMachine>) => void;
  onClose: () => void
}>();

const the_email = ref("");
watch(the_email, (oldValue) => {
  the_email.value = oldValue;
});

const emailIsValid = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !sharerExists(props.snapshot.context, email);
}

const onSubmit = async () => {
  props.send({type: "shareTasksList", id: props.snapshot.context.id, email: the_email.value});
  await waitUntil(() => !tasksListSharerAreUpdating(props.snapshot.value));
  props.onClose();
}
const onRemove = async (sharer: string) => {
  props.send({type: "unshareTasksList", id: props.snapshot.context.id, email: sharer});
  await waitUntil(() => !tasksListSharerAreUpdating(props.snapshot.value));
  props.onClose();
}

</script>

<template>
  <Modal title="Share tasks list" :on-close="onClose" size="medium">
    <div :class="modalStyles.body">
      <div :class="modalStyles.inputContainer">
        <input id="share-task-list-input" v-model="the_email" :class="modalStyles.input" type="text"/>
        <ButtonIcon the_id="share-task-list-submit" :icon="faAdd" v-on:click="onSubmit" :class="modalStyles.icon" title="Add sharer" :disabled="!emailIsValid(the_email)"/>
      </div>
      <div :class="shareModalStyles.container">
        <div v-for="sharer in getSharers(snapshot.context)" :key="sharer" :class="shareModalStyles.sharer">
          <span :id="sharer.replace('@', '').replace('.', '')">{{ sharer }}</span>
          <ButtonIcon :the_id="'unshare-' + sharer.replace('@', '').replace('.', '')" :icon="faMinus" v-on:click="onRemove(sharer)" title="Unshare tasks list"/>
        </div>
      </div>
    </div>
  </Modal>
</template>

<style scoped src="@/components/Modal.module.css"></style>
<style scoped src="@/components/tasks/TasksListModal.common.module.css"></style>
<style scoped src="@/components/tasks/ShareTasksListModal.module.css"></style>
