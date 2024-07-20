<script setup lang="ts">
import style from "./NotesList.module.css";
import { onMounted, onUnmounted, reactive, watch } from 'vue'
import { faPlusSquare, faCaretSquareDown } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { Actor, type EventFromLogic, type SnapshotFrom, type Subscription } from 'xstate'
import { notesMachine } from "@/state-machines/notes.state-machine";
import { NotesMachineCombinedStates } from "@/state-machines/notes.states";
import type { Id } from "@/types/types";
import { faList, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
let subscription: Subscription;

type NotesListModel = { name: string };
const props = defineProps<{
  snapshot: SnapshotFrom<typeof notesMachine>;
  send: (event: EventFromLogic<typeof notesMachine>) => void;
  actorRef: Actor<typeof notesMachine>;
}>();

const notesListModel: NotesListModel = reactive({ name: "" });
watch(notesListModel, (newValue: NotesListModel, oldValue: NotesListModel) => {
  newValue.name = oldValue.name.slice(0, 50);
});

let selectedNotesList: { id: number } = reactive({ id: 0 });
watch(selectedNotesList, (newValue: Id) => {
  if (props.snapshot.context.notesLists.length === 1) return;
  props.send({ type: "selectNotesList", id: newValue.id });
});

const notesListInputCollapsedModel: { collapsed: boolean } = reactive({ collapsed: false });
const notesListSelectCollapsedModel: { collapsed: boolean } = reactive({ collapsed: false });

const onClick = () => {
  props.send({ type: "readyToAddFirstNoteList" });
};
const disabled = () => notesListModel.name.length === 0;
const submit = () => {
  if (disabled()) return;
  props.send({ type: "addNotesList", name: notesListModel.name });
  notesListModel.name = "";
};

const toggleNotesList = () => {
  notesListInputCollapsedModel.collapsed = !notesListInputCollapsedModel.collapsed;
};

const toggleNotesSelect = () => {
  notesListSelectCollapsedModel.collapsed = !notesListSelectCollapsedModel.collapsed;
};

onMounted(() => {
  subscription = props.actorRef.subscribe((s) => {
    if (s.context.notesLists.length === 1) {
      selectedNotesList.id = s.context.notesLists[0].id;
    }
  });
});

onUnmounted(() => {
  subscription.unsubscribe();
});

</script>

<template>
  <div :class="style.container">
    <div :class="style.placeholder" id="add-note-list-placeholder" v-on:click="onClick()" v-if="snapshot.value === NotesMachineCombinedStates.empty">
      <span>Create your first note list</span>
    </div>
    <div :class="style.header" v-if="snapshot.value !== NotesMachineCombinedStates.empty">
      <FontAwesomeIcon :class="style.span" :icon="faPlusCircle" />
      <FontAwesomeIcon :class="`${notesListInputCollapsedModel.collapsed ? '' : 'fa-rotate-180'} ${style.caret}`" :icon="faCaretSquareDown" id="notes-list-input-caret" v-on:click="toggleNotesList()"/>
    </div>    
    <div :class="style.addNoteList" v-if="snapshot.value !== NotesMachineCombinedStates.empty && !notesListInputCollapsedModel.collapsed">
      <label :class="style.label" for="add-note-list-input">Add Notes List</label>
      <input :class="style.input" id="add-note-list-input" type="text" v-model="notesListModel.name" />
      <FontAwesomeIcon :class="`${disabled() ? style.disabled : ''} ${style.addNoteListIcon}`" :icon="faPlusSquare" id="add-note-list-submit" v-on:click="submit()"/>
      <span :class="style.characterCount" id="notes-list-character-count">{{notesListModel.name.length > 0 ? notesListModel.name.length + "/50" : "" }}</span>
    </div>
    <div :class="style.header" v-if="snapshot.context.notesLists.length > 1">
      <FontAwesomeIcon :class="style.span" :icon="faList" />
      <FontAwesomeIcon :class="`${notesListSelectCollapsedModel.collapsed ? '' : 'fa-rotate-180'} ${style.caret}`" :icon="faCaretSquareDown" id="notes-list-select-caret" v-on:click="toggleNotesSelect()"/>
    </div>
    <div v-if="snapshot.context.notesLists.length > 1 && !notesListSelectCollapsedModel.collapsed" :class="style.selectNotesList">
      <label :class="style.label" for="note-list-single-select">Select Notes List</label>
      <select :class="style.input" id="note-list-single-select" v-model="selectedNotesList.id">
        <option v-for="option in snapshot.context.notesLists" :value="option.id" :key="option.id">
          {{ option.name }}
        </option>
      </select>
    </div>
  </div>
</template>
