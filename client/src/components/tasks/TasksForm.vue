<script lang="ts" setup>
import {tasksMachine} from "@/state-machines/tasks.state-machine";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faPlusSquare} from "@fortawesome/free-regular-svg-icons";
import Task from "@/components/tasks/Task.vue";
import {reactive, watch} from "vue";
import styles from "./TasksForm.module.css";
import {type EventFromLogic, type SnapshotFrom} from 'xstate'
import {TasksMachineCombinedStates} from "@/state-machines/tasks.states";
import {canCarryTask} from "@/state-machines/tasks.extensions";
import * as _ from "lodash";

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
    <div v-if="_.isEqual(snapshot.value, TasksMachineCombinedStates.addingTasksListsEmpty,)" id="add-first-task"
         v-on:click="send({ type: 'readyToAddFirstTask' })">
      Add your first task
    </div>
    <div v-if="_.isEqual(snapshot.value, TasksMachineCombinedStates.addingTasksListsAddingTasks)" id="add-task"
         :class="styles.addTask">
      <input id="add-task-input" v-model="model.taskText" :class="styles.input" type="text"/>
      <FontAwesomeIcon id="add-task-submit" :class="`${disabled() ? styles.disabled : ''} ${styles.addTaskIcon}`"
                       :icon="faPlusSquare" v-on:click="submit()"/>
      <span id="character-count"
            :class="styles.characterCount">{{ model.taskText.length > 0 ? model.taskText.length + "/150" : "" }}</span>
    </div>
  </div>
  <div
      :class="`${_.isEqual(snapshot.value, TasksMachineCombinedStates.addingTasksListsAddingTasks) ? '' : `${styles.addMargin}`} ${styles.taskList}`">
    <Task v-for="task in snapshot.context.tasks" :key="task.id + '.' + task.page" :carry="carry" :choosing-tasks-to-carry="_.isEqual(snapshot.value, TasksMachineCombinedStates.addingTasksListsChoosingTasksToCarry)"
          :remove="remove" :show-carry-action="_.isEqual(snapshot.value, TasksMachineCombinedStates.addingTasksListsChoosingTasksToCarry) &&
          snapshot.context.tasks.find((n) => n.id === task.id && n.carried === false && canCarryTask(n)) !== undefined"
          :show-remove-action="_.isEqual(snapshot.value, TasksMachineCombinedStates.addingTasksListsChoosingTasksToCarry) &&
        snapshot.context.tasks.find((n) => n.id === task.id && n.carried === false && n.ticked === false) !== undefined"
          :show-tick-action="_.isEqual(snapshot.value, TasksMachineCombinedStates.addingTasksListsAddingTasks) &&
          snapshot.context.tasks.find((n) => n.id === task.id && n.ticked === false) !== undefined"
          :task="task"
          :tick="tick"
    />
  </div>
</template>
