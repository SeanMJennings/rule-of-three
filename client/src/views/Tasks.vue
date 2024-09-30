<script lang="ts" setup>
import { taskLimit, tasksMachine } from "@/state-machines/tasks.state-machine";
import styles from "./Tasks.module.css";
import TasksCounter from "@/components/tasks/TasksCounter.vue";
import TasksForm from "@/components/tasks/TasksForm.vue";
import TasksList from "@/components/tasks/TasksList.vue";
import { ReadyToAddTasks } from "@/state-machines/tasks.extensions";
import { Actor, type EventFromLogic, type SnapshotFrom } from 'xstate'

const props = defineProps<{
  tasksMachineProvider: () => {
    snapshot: SnapshotFrom<typeof tasksMachine>;
    send: (event: EventFromLogic<typeof tasksMachine>) => void;
    actorRef: Actor<typeof tasksMachine>;
  }
}>();

const { snapshot, send, actorRef } = props.tasksMachineProvider();
</script>

<template>
  <main>
    <div :class="styles.container">
      <TasksList :send="send" :snapshot="snapshot" :actorRef="actorRef"/>
      <TasksCounter :max-tasks="taskLimit" :task-count="snapshot.context.tasks.length"/>
      <TasksForm v-if="ReadyToAddTasks(snapshot.value)" :send="send" :snapshot="snapshot"/>
    </div>
  </main>
</template>
