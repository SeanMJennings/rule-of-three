<script lang="ts" setup>
import {tasksMachine} from "@/state-machines/tasks.state-machine";
import {faPlusSquare} from "@fortawesome/free-regular-svg-icons";
import Task from "@/components/tasks/Task.vue";
import {reactive, watch} from 'vue'
import styles from "./TasksForm.module.css";
import {type EventFromLogic, type SnapshotFrom} from 'xstate'
import {TasksMachineCombinedStates} from "@/state-machines/tasks.states";
import {
  canCarryTask,
  canRemoveTask, carryingOrRemovingTasks,
  getTasks,
  showAddFirstTask,
  showTickTasks
} from "@/state-machines/tasks.extensions";
import * as _ from "lodash";
import ButtonIcon from "@/components/ButtonIcon.vue";
import commonStyle from './Tasks.common.module.css'

const props = defineProps<{
  snapshot: SnapshotFrom<typeof tasksMachine>;
  send: (event: EventFromLogic<typeof tasksMachine>) => void;
}>();

type Model = { taskText: string };
const model: Model = reactive({taskText: ""});
watch(model, (newValue: Model, oldValue: Model) => {
  newValue.taskText = oldValue.taskText.slice(0, 150);
});

const disabled = () => model.taskText.length === 0;
const submit = () => {
  if (disabled()) return;
  props.send({type: "add", content: model.taskText});
};
const tick = (id: string | number) => {
  props.send({type: "tick", id: id});
};
const carry = (id: string | number) => {
  props.send({type: "carry", id: id});
};
const remove = (id: string | number) => {
  props.send({type: "remove", id: id});
};

</script>

<template>
  <div :class="styles.container">
    <div :class="styles.placeholder" v-if="showAddFirstTask(snapshot.value)" id="add-first-task" v-on:click="send({ type: 'readyToAddFirstTask' })">
      Add your first task
    </div>
    <div v-if="!showAddFirstTask(snapshot.value)" id="add-task" :class="styles.addTask">
      <div :class="commonStyle.inputContainer">
        <input id="add-task-input" v-model="model.taskText" :class="commonStyle.input" type="text"/>
        <ButtonIcon :icon="faPlusSquare" :iconStyle="`${disabled() ? commonStyle.disabled : ''} ${commonStyle.addIcon}`" the_id="add-task-submit" v-on:click="submit()" :disabled="!_.isEqual(snapshot.value, TasksMachineCombinedStates.addingTasksListsAddingTasks)"/>
      </div>
      <span id="character-count" :class="commonStyle.characterCount">{{ model.taskText.length > 0 ? model.taskText.length + "/150" : "" }}</span>
    </div>
  </div>
  <div :class="styles.taskList">
    <Task v-for="task in getTasks(snapshot.context)"
          :task="task"
          :key="task.id + '.' + task.page" 
          :carry="carry"
          :remove="remove"
          :tick="tick"
          :show-carry-action="carryingOrRemovingTasks(snapshot.value) && canCarryTask(task)"
          :show-remove-action="carryingOrRemovingTasks(snapshot.value) && canRemoveTask(task)"
          :show-tick-action="showTickTasks(snapshot.value) && !task.ticked"
    />
  </div>
</template>
