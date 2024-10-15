<script lang="ts" setup>
import style from "./TasksCounter.module.css";

const props = defineProps<{
  taskCount: number;
  maxTasks: number;
}>();
</script>

<template>
  <div :class="`${props.taskCount === props.maxTasks ? style.maxTaskCount : ''} ${style.taskCountContainer}`">
    <div v-if="props.taskCount !== 0" id="task-count">
      {{ props.taskCount }}/{{ props.maxTasks }} tasks
    </div>
  </div>
</template>
