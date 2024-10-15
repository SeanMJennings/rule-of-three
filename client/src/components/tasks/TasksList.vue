<script lang="ts" setup>
import style from "./TasksList.module.css";
import {onMounted, onUnmounted, reactive, watch} from 'vue'
import {faCaretSquareDown, faPlusSquare} from "@fortawesome/free-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {Actor, type EventFromLogic, type SnapshotFrom, type Subscription} from 'xstate'
import {tasksMachine} from "@/state-machines/tasks.state-machine";
import {TasksListMachineStates, TasksMachineCombinedStates} from "@/state-machines/tasks.states";
import type {Id} from "@/types/types";
import {faList, faPlusCircle} from '@fortawesome/free-solid-svg-icons'
import ButtonIcon from "@/components/ButtonIcon.vue";

let subscription: Subscription;

type TasksListModel = { name: string };
const props = defineProps<{
  snapshot: SnapshotFrom<typeof tasksMachine>;
  send: (event: EventFromLogic<typeof tasksMachine>) => void;
  actorRef: Actor<typeof tasksMachine>;
}>();

const tasksListModel: TasksListModel = reactive({name: ""});
watch(tasksListModel, (newValue: TasksListModel, oldValue: TasksListModel) => {
  newValue.name = oldValue.name.slice(0, 50);
});

let selectedTasksList: { id: number } = reactive({id: 0});
watch(selectedTasksList, (newValue: Id) => {
  if (props.snapshot.context.tasksLists.length === 1) return;
  props.send({type: "selectTasksList", id: newValue.id});
});

const tasksListInputCollapsedModel: { collapsed: boolean } = reactive({collapsed: false});
const tasksListSelectCollapsedModel: { collapsed: boolean } = reactive({collapsed: false});

const onClick = () => {
  props.send({type: "readyToAddFirstTaskList"});
};
const disabled = () => tasksListModel.name.length === 0;
const submit = () => {
  if (disabled()) return;
  props.send({type: "addTasksList", name: tasksListModel.name});
  tasksListModel.name = "";
};
const disableAddTaskListButton = () => props.snapshot.value === TasksListMachineStates.creatingTheTasksList || props.snapshot.value === TasksListMachineStates.updatingTheTasksList;

const toggleTasksList = () => {
  tasksListInputCollapsedModel.collapsed = !tasksListInputCollapsedModel.collapsed;
};

const toggleTasksSelect = () => {
  tasksListSelectCollapsedModel.collapsed = !tasksListSelectCollapsedModel.collapsed;
};

onMounted(() => {
  subscription = props.actorRef.subscribe((s) => {
    if (s.context.tasksLists.length === 1) {
      selectedTasksList.id = s.context.tasksLists[0].id;
    }
  });
});

onUnmounted(() => {
  subscription.unsubscribe();
});

</script>

<template>
  <div :class="style.container">
    <div v-if="snapshot.value === TasksMachineCombinedStates.empty" id="add-task-list-placeholder" :class="style.placeholder"
         v-on:click="onClick()">
      <span>Create your first task list</span>
    </div>
    <div v-if="snapshot.value !== TasksMachineCombinedStates.empty" :class="style.header">
      <ButtonIcon :class="style.button" :iconStyle="style.icon" :icon="faPlusCircle"/>
      <ButtonIcon the_id="tasks-list-input-caret" :iconStyle="`${tasksListInputCollapsedModel.collapsed ? '' : 'fa-rotate-180'} ${style.caret}`" :icon="faCaretSquareDown" v-on:click="toggleTasksList()"/>
    </div>
    <div v-if="snapshot.value !== TasksMachineCombinedStates.empty && !tasksListInputCollapsedModel.collapsed"
         :class="style.addTaskList">
      <label :class="style.label" for="add-task-list-input">Add Tasks List</label>
      <input id="add-task-list-input" v-model="tasksListModel.name" :class="style.input" type="text"/>
      <ButtonIcon the_id="add-task-list-submit" :disabled="disableAddTaskListButton()" :icon="faPlusSquare" :iconStyle="`${disabled() ? style.disabled : ''} ${style.addTaskListIcon}`" v-on:click="submit()"/>
      <span id="tasks-list-character-count" :class="style.characterCount">{{
          tasksListModel.name.length > 0 ? tasksListModel.name.length + "/50" : ""
        }}</span>
    </div>
    <div v-if="snapshot.context.tasksLists.length > 1" :class="style.header">
      <ButtonIcon :class="style.button" :iconStyle="style.icon" :icon="faList"/>
      <ButtonIcon the_id="tasks-list-select-caret" :iconStyle="`${tasksListSelectCollapsedModel.collapsed ? '' : 'fa-rotate-180'} ${style.caret}`" :icon="faCaretSquareDown" v-on:click="toggleTasksSelect()"/>
    </div>
    <div v-if="snapshot.context.tasksLists.length > 1 && !tasksListSelectCollapsedModel.collapsed"
         :class="style.selectTasksList">
      <label :class="style.label" for="task-list-single-select">Select Tasks List</label>
      <select id="task-list-single-select" v-model="selectedTasksList.id" :class="style.input">
        <option v-for="option in snapshot.context.tasksLists" :key="option.id" :value="option.id">
          {{ option.name }}
        </option>
      </select>
    </div>
  </div>
</template>
