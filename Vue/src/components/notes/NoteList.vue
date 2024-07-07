<script setup lang="ts">
import style from "./NoteList.module.css";
import { reactive, watch } from "vue";
import { faPlusSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import type { SnapshotFrom } from "xstate";
import { notesMachine } from "@/state-machines/notes.state-machine";
import { NotesMachineCombinedStates } from "@/state-machines/notes.states";
import { getNotesLists, subscribeToStore } from "@/state-machines/notes.store";
import type { Id, NotesList } from "@/types/types";

type NotesListModel = { name: string };
type NotesListOptions = { lists: NotesList[] };
const props = defineProps<{
  snapshot: SnapshotFrom<typeof notesMachine>;
  send: any;
}>();

const notesListModel: NotesListModel = reactive({ name: "" });
watch(notesListModel, (newValue: NotesListModel, oldValue: NotesListModel) => {
  newValue.name = oldValue.name.slice(0, 50);
});

let selectedNotesList: { id: number } = reactive({ id: 0 });
watch(selectedNotesList, (newValue: Id) => {
  props.send({ type: "selectNoteList", listId: newValue.id });
});

let notesLists: NotesListOptions = reactive({ lists: getNotesLists() });
subscribeToStore((snapshot) => {
  notesLists.lists = snapshot.context.notesLists;
  if (notesLists.lists.length === 1) {
    selectedNotesList.id = notesLists.lists[0].id;
  }
  console.log(props.snapshot.value);
});

const onClick = () => {
  props.send({ type: "readyToAddFirstNoteList" });
};
const disabled = () => notesListModel.name.length === 0;
const submit = () => {
  if (disabled()) return;
  props.send({ type: "addNotesList", name: notesListModel.name });
  notesListModel.name = "";
};
</script>

<template>
  <div
    :class="style.placeholder"
    id="add-note-list-placeholder"
    v-on:click="onClick()"
    v-if="snapshot.value === NotesMachineCombinedStates.empty"
  >
    Create your first note list
  </div>
  <div
    :class="style.addNoteList"
    v-if="snapshot.value !== NotesMachineCombinedStates.empty"
  >
    <input id="add-note-list-input" type="text" v-model="notesListModel.name" />
    <FontAwesomeIcon
      :class="`${disabled() ? style.disabled : ''} ${style.addNoteListIcon}`"
      :icon="faPlusSquare"
      id="add-note-list-submit"
      v-on:click="submit()"
    />
  </div>
  <div v-if="notesLists.lists.length !== 0" :class="style.selectNotesList">
    <select id="note-list-single-select" v-model="selectedNotesList.id">
      <option
        v-for="option in notesLists.lists"
        :value="option.id"
        :key="option.id"
      >
        {{ option.name }}
      </option>
    </select>
  </div>
</template>
