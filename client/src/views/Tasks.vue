<script lang="ts" setup>
import {tasksMachine} from "@/state-machines/tasks.state-machine";
import styles from "./Tasks.module.css";
import TasksCounter from "@/components/tasks/TasksCounter.vue";
import TasksForm from "@/components/tasks/TasksForm.vue";
import TasksList from "@/components/tasks/TasksList.vue";
import {getTasks, loading, readyToAddTasks, taskLimit} from "@/state-machines/tasks.extensions";
import {Actor, type EventFromLogic, type SnapshotFrom, type Subscription} from 'xstate'
import {VueSpinner} from "vue3-spinners";
import {onMounted, onUnmounted, reactive} from "vue";
let subscription: Subscription;

const props = defineProps<{
  tasksMachineProvider: () => {
    snapshot: SnapshotFrom<typeof tasksMachine>;
    send: (event: EventFromLogic<typeof tasksMachine>) => void;
    actorRef: Actor<typeof tasksMachine>;
  }
}>();

const {snapshot, send, actorRef} = props.tasksMachineProvider();
const showLoading = reactive({loading: true});

onMounted(() => {
  subscription = actorRef.subscribe((s) => {
    showLoading.loading = loading(s.value);
  });
});

onUnmounted(() => {
  subscription.unsubscribe();
});
</script>

<template>
  <main>
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
