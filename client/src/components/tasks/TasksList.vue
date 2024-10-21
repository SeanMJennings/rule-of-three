<script lang="ts" setup>
import style from "./TasksList.module.css";
import {onMounted, onUnmounted, reactive, watch} from 'vue'
import {faCaretSquareDown, faPlusSquare} from "@fortawesome/free-regular-svg-icons";
import {Actor, type EventFromLogic, type SnapshotFrom, type Subscription} from 'xstate'
import {tasksMachine} from "@/state-machines/tasks.state-machine";
import {TasksListMachineStates, TasksMachineCombinedStates} from "@/state-machines/tasks.states";
import type {Id} from "@/types/types";
import {faList, faPlusCircle} from '@fortawesome/free-solid-svg-icons'
import ButtonIcon from "@/components/ButtonIcon.vue";
import commonStyle from './Tasks.common.module.css'
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

let selectedTasksList: { id: string } = reactive({id: ''});
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
    if (s.context.tasksLists.length > 0 && selectedTasksList.id === '') {
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
    <div v-if="snapshot.value === TasksMachineCombinedStates.empty" id="add-task-list-placeholder" :class="style.placeholder" v-on:click="onClick()">
      <span>Create your first task list</span>
    </div>
    <div v-if="snapshot.value !== TasksMachineCombinedStates.empty" :class="style.header" v-on:click="toggleTasksList()">
      <ButtonIcon :class="commonStyle.button" :icon="faPlusCircle" :iconStyle="commonStyle.icon"/>
      <ButtonIcon :icon="faCaretSquareDown" :iconStyle="`${tasksListInputCollapsedModel.collapsed ? '' : 'fa-rotate-180'} ${style.caret}`" the_id="tasks-list-input-caret"/>
    </div>
    <div v-if="snapshot.value !== TasksMachineCombinedStates.empty && !tasksListInputCollapsedModel.collapsed" :class="commonStyle.formSection">
      <label :class="commonStyle.label" for="add-task-list-input">Add Tasks List</label>
      <div :class="commonStyle.inputContainer">
        <input id="add-task-list-input" v-model="tasksListModel.name" :class="commonStyle.input" type="text"/>
        <ButtonIcon :disabled="disableAddTaskListButton()" :icon="faPlusSquare" :iconStyle="`${disabled() ? commonStyle.disabled : ''} ${commonStyle.addIcon}`" the_id="add-task-list-submit" v-on:click="submit()"/>
      </div>
      <span id="tasks-list-character-count" :class="commonStyle.characterCount">{{tasksListModel.name.length > 0 ? tasksListModel.name.length + "/50" : "" }}</span>
    </div>
    <div v-if="snapshot.context.tasksLists.length > 0" :class="style.header" v-on:click="toggleTasksSelect()">
      <ButtonIcon :class="commonStyle.button" :icon="faList" :iconStyle="commonStyle.icon"/>
      <ButtonIcon :icon="faCaretSquareDown" :iconStyle="`${tasksListSelectCollapsedModel.collapsed ? '' : 'fa-rotate-180'} ${style.caret}`" the_id="tasks-list-select-caret" />
    </div>
    <div v-if="snapshot.context.tasksLists.length > 0 && !tasksListSelectCollapsedModel.collapsed" :class="commonStyle.formSection">
      <label :class="commonStyle.label" for="task-list-single-select">Select Tasks List</label>
      <select id="task-list-single-select" v-model="selectedTasksList.id" :class="style.selectInput">
        <option v-for="(option, index) in snapshot.context.tasksLists" :key="option.id" :selected="index === 0" :value="option.id">
          {{ option.name }}
        </option>
      </select>
    </div>
  </div>
</template>
