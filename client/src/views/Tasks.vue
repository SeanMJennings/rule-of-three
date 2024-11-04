<script lang="ts" setup>
import {tasksMachine, type TasksMachineError} from "@/state-machines/tasks.state-machine";
import styles from "./Tasks.module.css";
import TasksCounter from "@/components/tasks/TasksCounter.vue";
import TasksForm from "@/components/tasks/TasksForm.vue";
import TasksList from "@/components/tasks/TasksList.vue";
import {getTasks, loading, readyToAddTasks, taskLimit} from "@/state-machines/tasks.extensions";
import {Actor, type EventFromLogic, type SnapshotFrom, type Subscription} from 'xstate'
import {VueSpinner} from "vue3-spinners";
import {onMounted, onUnmounted, ref} from "vue";
import Overlay from "@/components/Overlay.vue";
let subscription: Subscription;
let errorSubscription: Subscription;

const props = defineProps<{
  tasksMachineProvider: () => {
    snapshot: SnapshotFrom<typeof tasksMachine>;
    send: (event: EventFromLogic<typeof tasksMachine>) => void;
    actorRef: Actor<typeof tasksMachine>;
  }
}>();

const {snapshot, send, actorRef} = props.tasksMachineProvider();
const showLoading = ref(true)
const showErrorModal = ref(false)
const theError = ref("")
const code = ref(0)
const closeErrorModal = () => {
  showErrorModal.value = false;
  theError.value = "";
  code.value = 0;
}

onMounted(() => {
  subscription = actorRef.subscribe((s) => {
    showLoading.value = loading(s.value);
  });
  errorSubscription = actorRef.on('error', (e) => {
    theError.value = (e as TasksMachineError).error;
    code.value = (e as TasksMachineError).code;
    showErrorModal.value = true;
  })
});

onUnmounted(() => {
  subscription.unsubscribe();
  errorSubscription.unsubscribe();
});
</script>

<template>
    <Overlay v-if="showErrorModal" :the-error="theError" :code="code" :on-close="closeErrorModal"></Overlay>
    <div v-if="showLoading" :class="styles.container">
      <VueSpinner id="loadingSpinner" :class="styles.spinner" size="30" color="white" />
    </div>
    <div v-else :class="styles.container">
      <TasksList :actorRef="actorRef" :send="send" :snapshot="snapshot"/>
      <TasksCounter :max-tasks=taskLimit :task-count="getTasks(snapshot.context).length"/>
      <TasksForm v-if="readyToAddTasks(snapshot.value)" :send="send" :snapshot="snapshot"/>
    </div>
</template>
