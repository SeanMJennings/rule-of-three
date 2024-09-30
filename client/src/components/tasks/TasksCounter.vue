<script setup lang="ts">
import style from "./TasksCounter.module.css";
const props = defineProps<{
  taskCount: number;
  maxTasks: number;
}>();
</script>

<template>
  <div :class="`${props.taskCount === props.maxTasks ? style.maxTaskCount : ''} ${style.taskCountContainer}`">
    <div id="task-count" v-if="props.taskCount !== 0">
      {{ props.taskCount }}/{{ props.maxTasks }} tasks
    </div>
  </div>
</template>
