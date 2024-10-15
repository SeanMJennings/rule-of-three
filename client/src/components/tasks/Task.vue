<script lang="ts" setup>
import {type Task} from "@/types/types";
import {faArrowRight, faCheck, faX} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
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
    <span
        :id="`task-${props.task.id}`"
        :class="`${task.ticked ? style.taskTicked : !showTickAction && props.task.carried ? style.taskKept : ''} ${style.task}`">{{ props.task.content }}</span>
    <span :id="`task-${props.task.id}-page`" :class="style.page">{{ props.task.page }}</span>
    <div v-if="!showRemoveAction && !showCarryAction && !showTickAction"
         :class="`${choosingTasksToCarry ? style.largeSpacer : style.spacer}`"/>
    <FontAwesomeIcon v-if="showTickAction" :id="`task-${props.task.id}-tick`" :class="style.icon" :icon="faCheck"
                     v-on:click="tick(props.task.id)"/>
    <FontAwesomeIcon v-if="showCarryAction" :id="`task-${props.task.id}-carry`" :class="style.icon" :icon="faArrowRight"
                     v-on:click="carry(props.task.id)"/>
    <FontAwesomeIcon v-if="showRemoveAction" :id="`task-${props.task.id}-remove`"
                     :class="`${showCarryAction ? style.carryActionShown : ''} ${style.icon}`" :icon="faX" v-on:click="remove(props.task.id)"/>
  </div>
</template>
