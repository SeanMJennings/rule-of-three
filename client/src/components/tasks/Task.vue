<script lang="ts" setup>
import {type Task} from "@/types/types";
import {faArrowRight, faCheck, faX} from '@fortawesome/free-solid-svg-icons'
import style from "./Task.module.css";
import ButtonIcon from "@/components/ButtonIcon.vue";

defineProps<{
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
    <span :id="`task-${task.id}`" :class="`${task.ticked ? style.taskTicked : task.carried ? style.taskCarried : task.removed ? style.taskRemoved : ''} ${style.task}`">{{task.content }}</span>
    <span :id="`task-${task.id}-page`" :class="style.page">{{ task.page }}</span>
    <div v-if="!showRemoveAction && !showCarryAction && !showTickAction" :class="`${choosingTasksToCarry ? style.largeSpacer : style.spacer}`"/>
    <ButtonIcon :the_id="`task-${task.id}-tick`" :icon="faCheck" :icon-style="style.icon" v-if="showTickAction" v-on:click="tick(task.id)"/>
    <ButtonIcon :the_id="`task-${task.id}-carry`" :icon="faArrowRight" :icon-style="style.icon" v-if="showCarryAction" v-on:click="carry(task.id)"/>
    <ButtonIcon :the_id="`task-${task.id}-remove`" :icon="faX" :icon-style="`${showCarryAction ? style.carryActionShown : ''} ${style.icon}`" v-if="showRemoveAction" v-on:click="remove(task.id)"/>
  </div>
</template>
