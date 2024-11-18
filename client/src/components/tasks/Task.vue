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
  tick: (id: string | number) => void;
  carry: (id: string | number) => void;
  remove: (id: string | number) => void;
}>();

</script>

<template>
  <div :class="style.div">
    <span :class="style.marker">></span>
    <span :id="`task-${task.id}`" :class="`${task.ticked ? style.taskTicked : task.carried ? style.taskCarried : task.removed ? style.taskRemoved : ''} ${style.task}`">{{task.content }}</span>
    <div :class="style.actionsContainer">
      <span :id="`task-${task.id}-page`" :class="`${task.ticked ? style.taskTicked : task.carried ? style.taskCarried : task.removed ? style.taskRemoved : ''} ${style.page}`">{{ task.page }}</span>
      <ButtonIcon title="Tick" :class="style.button" :the_id="`task-${task.id}-tick`" :icon="faCheck" v-if="showTickAction" v-on:click="tick(task.id)"/>
      <ButtonIcon title="Carry" :class="style.button" :the_id="`task-${task.id}-carry`" :icon="faArrowRight" v-if="showCarryAction" v-on:click="carry(task.id)"/>
      <ButtonIcon title="Remove" :class="style.button" :the_id="`task-${task.id}-remove`" :icon="faX" v-if="showRemoveAction" v-on:click="remove(task.id)"/>
    </div>
  </div>
</template>
