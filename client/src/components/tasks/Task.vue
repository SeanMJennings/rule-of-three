<script lang="ts" setup>
import {type Task} from "@/types/types";
import {faArrowRight, faCheck, faX} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import style from "./Task.module.css";
import ButtonIcon from "@/components/ButtonIcon.vue";

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
        :class="`${task.ticked ? style.taskTicked : !showTickAction && props.task.carried ? style.taskKept : ''} ${style.task}`">{{
        props.task.content
      }}</span>
    <span :id="`task-${props.task.id}-page`" :class="style.page">{{ props.task.page }}</span>
    <div v-if="!showRemoveAction && !showCarryAction && !showTickAction" :class="`${choosingTasksToCarry ? style.largeSpacer : style.spacer}`"/>
    <ButtonIcon :the_id="`task-${props.task.id}-tick`" :icon="faCheck" :icon-style="style.icon" v-if="showTickAction" v-on:click="tick(props.task.id)"/>
    <ButtonIcon :the_id="`task-${props.task.id}-carry`" :icon="faArrowRight" :icon-style="style.icon" v-if="showCarryAction" v-on:click="carry(props.task.id)"/>
    <ButtonIcon :the_id="`task-${props.task.id}-remove`" :icon="faX" :icon-style="`${showCarryAction ? style.carryActionShown : ''} ${style.icon}`" v-if="showRemoveAction" v-on:click="remove(props.task.id)"/>
  </div>
</template>
