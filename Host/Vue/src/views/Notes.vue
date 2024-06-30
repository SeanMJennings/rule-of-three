<script setup lang="ts">
import { useMachine } from '@xstate/vue'
import { itemLimit, notesMachine } from '@/state-machines/notes-state-machine'
import styles from './Notes.module.css'
import NoteCounter from '@/components/notes/NoteCounter.vue'
import NoteForm from '@/components/notes/NoteForm.vue'

const { snapshot, send } = useMachine(notesMachine)
</script>

<template>
  <main>
    <div :class=styles.container>
      <NoteCounter :note-count=snapshot.context.notes.length :max-notes=itemLimit />
      <NoteForm :send=send :snapshot=snapshot />
    </div>
  </main>
</template>