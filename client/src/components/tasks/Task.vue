<script setup lang="ts">
import { type Task } from "@/types/types";
import { faArrowRight, faCheck, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import style from "./Task.module.css";

const props = defineProps<{
  task: Task;
  showTickAction: boolean;
  showCarryAction: boolean;
  showRemoveAction: boolean;
  choosingTasksToCarry: boolean;
  tick: (id: string | number) => void;
  carry: (id: string | number) => void;
  remove: (id: string | number) => void;
}>();

</script>

<template>
  <div :class="style.div">
    <span :class="style.marker">></span>
    <span :class="`${task.ticked ? style.taskTicked : !showTickAction && props.task.carried ? style.taskKept : ''} ${style.task}`" :id="`task-${props.task.id}`">{{props.task.content }}</span>
    <span :class="style.page" :id="`task-${props.task.id}-page`">{{props.task.page }}</span>
    <div v-if="!showRemoveAction && !showCarryAction && !showTickAction" :class="`${choosingTasksToCarry ? style.largeSpacer : style.spacer}`"/>
    <FontAwesomeIcon :class="style.icon" :icon="faCheck" :id="`task-${props.task.id}-tick`" v-if="showTickAction" v-on:click="tick(props.task.id)"/>
    <FontAwesomeIcon :class="style.icon" :icon="faArrowRight" :id="`task-${props.task.id}-carry`" v-if="showCarryAction" v-on:click="carry(props.task.id)"/>
    <FontAwesomeIcon :class="`${showCarryAction ? style.carryActionShown : ''} ${style.icon}`" :icon="faX" :id="`task-${props.task.id}-remove`" v-if="showRemoveAction" v-on:click="remove(props.task.id)"/>
  </div>
</template>
