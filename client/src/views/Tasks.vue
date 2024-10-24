<script lang="ts" setup>
import {tasksMachine, type TasksMachineError} from "@/state-machines/tasks.state-machine";
import styles from "./Tasks.module.css";
import TasksCounter from "@/components/tasks/TasksCounter.vue";
import TasksForm from "@/components/tasks/TasksForm.vue";
import TasksList from "@/components/tasks/TasksList.vue";
import {getTasks, loading, readyToAddTasks, taskLimit} from "@/state-machines/tasks.extensions";
import {Actor, type EventFromLogic, type SnapshotFrom, type Subscription} from 'xstate'
import {VueSpinner} from "vue3-spinners";
import {onMounted, onUnmounted, reactive} from "vue";
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
const showLoading = reactive({loading: true});
const showErrorModalContainer = reactive({showErrorModal: false});
const theErrorContainer = reactive({error: ""});
const closeErrorModal = () => showErrorModalContainer.showErrorModal = false;

onMounted(() => {
  subscription = actorRef.subscribe((s) => {
    showLoading.loading = loading(s.value);
  });
  errorSubscription = actorRef.on('error', (e) => {
    theErrorContainer.error = (e as TasksMachineError).error;
    showErrorModalContainer.showErrorModal = true;
  })
});

onUnmounted(() => {
  subscription.unsubscribe();
  errorSubscription.unsubscribe();
});
</script>

<template>
  <main>
    <Overlay v-if="showErrorModalContainer.showErrorModal" :the-error="theErrorContainer.error" :on-close="closeErrorModal"></Overlay>
    <div v-if="showLoading.loading" :class="styles.container">
      <VueSpinner id="loadingSpinner" :class="styles.spinner" size="30" color="white" />
    </div>
    <div v-else :class="styles.container">
      <TasksList :actorRef="actorRef" :send="send" :snapshot="snapshot"/>
      <TasksCounter :max-tasks=taskLimit :task-count="getTasks(snapshot.context).length"/>
      <TasksForm v-if="readyToAddTasks(snapshot.value)" :send="send" :snapshot="snapshot"/>
    </div>
  </main>
</template>
