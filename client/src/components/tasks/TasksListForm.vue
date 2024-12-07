<script lang="ts" setup>
import style from "./TasksListForm.module.css";
import {onMounted, onUnmounted, reactive, watch} from 'vue'
import {faCaretSquareDown, faPlusSquare} from "@fortawesome/free-regular-svg-icons";
import {Actor, type EventFromLogic, type SnapshotFrom, type Subscription} from 'xstate'
import {tasksMachine} from "@/state-machines/tasks.state-machine";
import {TasksListMachineStates} from "@/state-machines/tasks.states";
import type {Id} from "@/types/types";
import {faEdit, faPlusCircle, faTrash, faTasks, faShare, faRemove} from '@fortawesome/free-solid-svg-icons'
import ButtonIcon from "@/components/ButtonIcon.vue";
import commonStyle from './Tasks.common.module.css'
import {
  isOwner,
  notEmptyOrInitiallyLoading,
  readyToAddTasks,
  showCreateTasksList
} from "@/state-machines/tasks.extensions";
import {useAuth0} from "@auth0/auth0-vue";
let subscription: Subscription;

const auth0 = useAuth0();

type TasksListModel = { name: string };
const props = defineProps<{
  snapshot: SnapshotFrom<typeof tasksMachine>;
  send: (event: EventFromLogic<typeof tasksMachine>) => void;
  actorRef: Actor<typeof tasksMachine>;
  editingTaskListName: (value: boolean) => void;
  deletingTaskList: (value: boolean) => void;
  sharingTaskList: (value: boolean) => void;
  unsharingTaskListForSelf: (value: boolean) => void;
}>();

const tasksListModel: TasksListModel = reactive({name: ""});
watch(tasksListModel, (newValue: TasksListModel, oldValue: TasksListModel) => {
  newValue.name = oldValue.name.slice(0, 50);
});

let selectedTasksList: { id: string } = reactive({id: props.snapshot.context.id });
watch(selectedTasksList, (newValue: Id) => {
  if (props.snapshot.context.tasksLists.length === 1 || newValue.id === '') return;
  props.send({type: "selectTasksList", id: newValue.id});
});

const tasksListInputCollapsedModel: { collapsed: boolean } = reactive({collapsed: true});
const tasksListSelectCollapsedModel: { collapsed: boolean } = reactive({collapsed: true});

const readyToCreateFirstTaskList = () => {
  props.send({type: "readyToAddFirstTaskList"});
  tasksListInputCollapsedModel.collapsed = false;
};
const disabled = () => tasksListModel.name.length === 0;
const addTaskList = () => {
  if (disabled()) return;
  props.send({type: "addTasksList", name: tasksListModel.name});
  tasksListModel.name = "";
};

const openDeleteTaskList = () => {
  props.deletingTaskList(true);
};

const openEditTaskListName = () => {
  props.editingTaskListName(true);
};

const openShareTaskList = () => {
  props.sharingTaskList(true);
};

const openUnshareTaskList = () => {
  props.unsharingTaskListForSelf(true);
};

const disableAddTaskListButton = () => props.snapshot.value === TasksListMachineStates.creatingTheTasksList;

const toggleTasksList = () => {
  tasksListInputCollapsedModel.collapsed = !tasksListInputCollapsedModel.collapsed;
};

const toggleTasksSelect = () => {
  tasksListSelectCollapsedModel.collapsed = !tasksListSelectCollapsedModel.collapsed;
};

onMounted(() => {
  subscription = props.actorRef.subscribe((s) => {
      selectedTasksList.id = s.context.id;
  });
});

onUnmounted(() => {
  subscription.unsubscribe();
});

</script>

<template>
  <div :class="style.container">
    <div v-if="showCreateTasksList(snapshot.value)" id="add-task-list-placeholder" :class="style.placeholder" v-on:click="readyToCreateFirstTaskList()">
      <span>Create your first task list</span>
    </div>
    <div v-if="notEmptyOrInitiallyLoading(snapshot.value)" :class="commonStyle.header" v-on:click="toggleTasksList()">
      <ButtonIcon :class="commonStyle.button" :icon="faPlusCircle" title="" :disabled="true"/>
      <ButtonIcon :icon="faCaretSquareDown" :class="`${tasksListInputCollapsedModel.collapsed ? '' : 'fa-rotate-180'} ${style.caret}`" the_id="tasks-list-input-caret" title="Add tasks lists"/>
    </div>
    <div v-if="notEmptyOrInitiallyLoading(snapshot.value) && !tasksListInputCollapsedModel.collapsed" :class="commonStyle.formSection">
      <label :class="commonStyle.label" for="add-task-list-input">Add Tasks List</label>
      <div :class="commonStyle.inputContainer">
        <input id="add-task-list-input" v-model="tasksListModel.name" :class="commonStyle.input" type="text"/>
        <ButtonIcon :disabled="disableAddTaskListButton()" :icon="faPlusSquare" :class="`${disabled() ? commonStyle.disabled : ''} ${commonStyle.icon}`" the_id="add-task-list-submit" v-on:click="addTaskList()" title="Add tasks list"/>
      </div>
      <span id="tasks-list-character-count" :class="commonStyle.characterCount">{{tasksListModel.name.length > 0 ? tasksListModel.name.length + "/50" : "" }}</span>
    </div>
    <div v-if="readyToAddTasks(snapshot.value) && snapshot.context.tasksLists.length > 0" :class="commonStyle.header" v-on:click="toggleTasksSelect()">
      <ButtonIcon :class="commonStyle.button" :icon="faTasks" title="" :disabled="true"/>
      <ButtonIcon :icon="faCaretSquareDown" :class="`${tasksListSelectCollapsedModel.collapsed ? '' : 'fa-rotate-180'} ${style.caret}`" the_id="tasks-list-select-caret" title="Select tasks list"/>
    </div>
    <div v-if="readyToAddTasks(snapshot.value) && snapshot.context.tasksLists.length > 0 && !tasksListSelectCollapsedModel.collapsed" :class="commonStyle.formSection">
      <label :class="commonStyle.label" for="task-list-single-select">Select Tasks List</label>
      <div :class="style.selectInputContainer">
        <select id="task-list-single-select" v-model="selectedTasksList.id" :class="style.selectInput">
          <option v-for="(option, index) in snapshot.context.tasksLists" :key="option.id" :selected="index === 0" :value="option.id">
            {{ option.name }}
          </option>
        </select>
        <div :class="style.selectInputButtons">
          <ButtonIcon the_id="open-edit-task-list-name" :disabled="!isOwner(auth0.user.value?.email, props.snapshot.context)" :class="`${!isOwner(auth0.user.value?.email, props.snapshot.context) ? commonStyle.disabled : ''}`" :icon="faEdit" v-on:click="openEditTaskListName()" title="Edit tasks list name"/>
          <ButtonIcon the_id="open-delete-task-list"  :disabled="!isOwner(auth0.user.value?.email, props.snapshot.context)" :class="`${!isOwner(auth0.user.value?.email, props.snapshot.context) ? commonStyle.disabled : ''}`" :icon="faTrash" v-on:click="openDeleteTaskList()" title="Delete tasks list"/>
          <ButtonIcon v-if="isOwner(auth0.user.value?.email, snapshot.context)" the_id="open-share-task-list" :icon="faShare" v-on:click="openShareTaskList()" title="Share tasks list"/>
          <ButtonIcon v-if="!isOwner(auth0.user.value?.email, snapshot.context)" the_id="open-unshare-self" :icon="faRemove" v-on:click="openUnshareTaskList()" :class="commonStyle.icon" title="Unshare tasks list for self"/>
        </div>
      </div>
    </div>
  </div>
</template>
