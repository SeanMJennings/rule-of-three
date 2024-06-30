<script setup lang="ts">
import style from './NoteCounter.module.css'
const props = defineProps<{
  noteCount: number;
  maxNotes: number;
}>()
</script>

<template>
  <div
    :class="`${props.noteCount === props.maxNotes ? style.maxNoteCount : ''} ${style.noteCountContainer}`">
    <div id="note-count" v-if="props.noteCount !==0">{{ props.noteCount }}/{{ props.maxNotes }} notes</div>
  </div>
</template>
