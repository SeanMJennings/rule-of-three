<script lang="ts" setup>
import { noteLimit, notesMachine } from "@/state-machines/notes.state-machine";
import styles from "./Notes.module.css";
import NotesCounter from "@/components/notes/NotesCounter.vue";
import NotesForm from "@/components/notes/NotesForm.vue";
import NotesList from "@/components/notes/NotesList.vue";
import { ReadyToAddNotes } from "@/state-machines/notes.extensions";
import { Actor, type EventFromLogic, type SnapshotFrom } from 'xstate'

const props = defineProps<{
  notesMachineProvider: () => {
    snapshot: SnapshotFrom<typeof notesMachine>;
    send: (event: EventFromLogic<typeof notesMachine>) => void;
    actorRef: Actor<typeof notesMachine>;
  }
}>();

const { snapshot, send, actorRef } = props.notesMachineProvider();
</script>

<template>
  <main>
    <div :class="styles.container">
      <NotesList :send="send" :snapshot="snapshot" :actorRef="actorRef"/>
      <NotesCounter :max-notes="noteLimit" :note-count="snapshot.context.notes.length"/>
      <NotesForm v-if="ReadyToAddNotes(snapshot.value)" :send="send" :snapshot="snapshot"/>
    </div>
  </main>
</template>
