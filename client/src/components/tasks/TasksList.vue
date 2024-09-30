<script setup lang="ts">
import style from "./TasksList.module.css";
import { onMounted, onUnmounted, reactive, watch } from 'vue'
import { faPlusSquare, faCaretSquareDown } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { Actor, type EventFromLogic, type SnapshotFrom, type Subscription } from 'xstate'
import { tasksMachine } from "@/state-machines/tasks.state-machine";
import { TasksMachineCombinedStates } from "@/state-machines/tasks.states";
import type { Id } from "@/types/types";
import { faList, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
let subscription: Subscription;

type TasksListModel = { name: string };
const props = defineProps<{
  snapshot: SnapshotFrom<typeof tasksMachine>;
  send: (event: EventFromLogic<typeof tasksMachine>) => void;
  actorRef: Actor<typeof tasksMachine>;
}>();

const tasksListModel: TasksListModel = reactive({ name: "" });
watch(tasksListModel, (newValue: TasksListModel, oldValue: TasksListModel) => {
  newValue.name = oldValue.name.slice(0, 50);
});

let selectedTasksList: { id: number } = reactive({ id: 0 });
watch(selectedTasksList, (newValue: Id) => {
  if (props.snapshot.context.tasksLists.length === 1) return;
  props.send({ type: "selectTasksList", id: newValue.id });
});

const tasksListInputCollapsedModel: { collapsed: boolean } = reactive({ collapsed: false });
const tasksListSelectCollapsedModel: { collapsed: boolean } = reactive({ collapsed: false });

const onClick = () => {
  props.send({ type: "readyToAddFirstTaskList" });
};
const disabled = () => tasksListModel.name.length === 0;
const submit = () => {
  if (disabled()) return;
  props.send({ type: "addTasksList", name: tasksListModel.name });
  tasksListModel.name = "";
};

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
    <div :class="style.placeholder" id="add-task-list-placeholder" v-on:click="onClick()" v-if="snapshot.value === TasksMachineCombinedStates.empty">
      <span>Create your first task list</span>
    </div>
    <div :class="style.header" v-if="snapshot.value !== TasksMachineCombinedStates.empty">
      <FontAwesomeIcon :class="style.span" :icon="faPlusCircle" />
      <FontAwesomeIcon :class="`${tasksListInputCollapsedModel.collapsed ? '' : 'fa-rotate-180'} ${style.caret}`" :icon="faCaretSquareDown" id="tasks-list-input-caret" v-on:click="toggleTasksList()"/>
    </div>    
    <div :class="style.addTaskList" v-if="snapshot.value !== TasksMachineCombinedStates.empty && !tasksListInputCollapsedModel.collapsed">
      <label :class="style.label" for="add-task-list-input">Add Tasks List</label>
      <input :class="style.input" id="add-task-list-input" type="text" v-model="tasksListModel.name" />
      <FontAwesomeIcon :class="`${disabled() ? style.disabled : ''} ${style.addTaskListIcon}`" :icon="faPlusSquare" id="add-task-list-submit" v-on:click="submit()"/>
      <span :class="style.characterCount" id="tasks-list-character-count">{{tasksListModel.name.length > 0 ? tasksListModel.name.length + "/50" : "" }}</span>
    </div>
    <div :class="style.header" v-if="snapshot.context.tasksLists.length > 1">
      <FontAwesomeIcon :class="style.span" :icon="faList" />
      <FontAwesomeIcon :class="`${tasksListSelectCollapsedModel.collapsed ? '' : 'fa-rotate-180'} ${style.caret}`" :icon="faCaretSquareDown" id="tasks-list-select-caret" v-on:click="toggleTasksSelect()"/>
    </div>
    <div v-if="snapshot.context.tasksLists.length > 1 && !tasksListSelectCollapsedModel.collapsed" :class="style.selectTasksList">
      <label :class="style.label" for="task-list-single-select">Select Tasks List</label>
      <select :class="style.input" id="task-list-single-select" v-model="selectedTasksList.id">
        <option v-for="option in snapshot.context.tasksLists" :value="option.id" :key="option.id">
          {{ option.name }}
        </option>
      </select>
    </div>
  </div>
</template>
