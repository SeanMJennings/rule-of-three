<script lang="ts" setup>
import {tasksMachine, type TasksMachineError} from "@/state-machines/tasks.state-machine";
import styles from "./Tasks.module.css";
import TasksForm from "@/components/tasks/TasksForm.vue";
import TasksList from "@/components/tasks/TasksList.vue";
import {loading, readyToAddTasks, selectedTaskListName} from "@/state-machines/tasks.extensions";
import {Actor, type EventFromLogic, type SnapshotFrom, type Subscription} from 'xstate'
import {VueSpinner} from "vue3-spinners";
import {onMounted, onUnmounted, ref} from "vue";
import ErrorModal from "@/components/ErrorModal.vue";
import EditTasksListNameModal from "@/components/tasks/EditTasksListNameModal.vue";
import DeleteTasksListModal from "@/components/tasks/DeleteTasksListModal.vue";
let subscription: Subscription;
let timeout: NodeJS.Timeout;
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
const showEditTasksListNameModal = ref(false)
const showDeleteTasksListModal = ref(false)
const theError = ref("")
const code = ref(0)

const closeErrorModal = () => {
  showErrorModal.value = false;
  theError.value = "";
  code.value = 0;
}

const editingTaskListName = (value: boolean) => {
  showEditTasksListNameModal.value = value;
}

const deletingTaskList = (value: boolean) => {
  showDeleteTasksListModal.value = value;
}

const getTasksListName = () => {
  return selectedTaskListName(actorRef.getSnapshot().context);
}

onMounted(() => {
  subscription = actorRef.subscribe((s) => {
    clearTimeout(timeout);
    showLoading.value = false;
    timeout = setTimeout(() => {
      showLoading.value = loading(s.value)
    }, 1000);
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
    <ErrorModal v-if="showErrorModal" :the-error="theError" :code="code" :on-close="closeErrorModal" />
    <EditTasksListNameModal v-if="showEditTasksListNameModal" :on-close="() => editingTaskListName(false)" :send="send" :snapshot="snapshot" :name="getTasksListName()" />
    <DeleteTasksListModal v-if="showDeleteTasksListModal" :on-close="() => deletingTaskList(false)" :send="send" :snapshot="snapshot"  />
  <div :class="styles.container">
    <div v-if="showLoading" :class="styles.spinnerContainer">
      <VueSpinner id="loadingSpinner" size="30" color="white" />
    </div>
    <TasksList :actorRef="actorRef" :send="send" :snapshot="snapshot" :editingTaskListName="editingTaskListName" :deletingTaskList="deletingTaskList"/>
    <TasksForm v-if="readyToAddTasks(snapshot.value)" :send="send" :snapshot="snapshot"/>
  </div>
</template>
