<script setup lang="ts">
import { type Note } from '@/types/types'
const props = defineProps<{
  note: Note
}>()
</script>

<template>
  <div>
    <span>></span>
    <span class="note" :id="`note-${props.note.id}`">{{ props.note.content }}</span>
  </div>
</template>

<style src="@/components/Note.css" scoped></style>
