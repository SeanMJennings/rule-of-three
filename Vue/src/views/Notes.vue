<script lang="ts" setup>
import { useMachine } from "@xstate/vue";
import { noteLimit, notesMachine } from "@/state-machines/notes.state-machine";
import styles from "./Notes.module.css";
import NoteCounter from "@/components/notes/NoteCounter.vue";
import NoteForm from "@/components/notes/NoteForm.vue";
import NoteList from "@/components/notes/NoteList.vue";
import { ReadyToAddNotes } from "@/state-machines/notes.extensions";

const { snapshot, send } = useMachine(notesMachine);
</script>

<template>
  <main>
    <div :class="styles.container">
      <NoteList :send="send" :snapshot="snapshot" />
      <NoteCounter
        :max-notes="noteLimit"
        :note-count="snapshot.context.notes.length"
      />
      <NoteForm
        v-if="ReadyToAddNotes(snapshot.value)"
        :send="send"
        :snapshot="snapshot"
      />
    </div>
  </main>
</template>
