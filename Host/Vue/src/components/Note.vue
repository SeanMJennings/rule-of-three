<script setup lang="ts">
import { type Note } from '@/types/types'
import { faCheck, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
const props = defineProps<{
  note: Note
  showActions: boolean
  carry: (id: string | number) => void
  remove: (id: string | number) => void
}>()
</script>

<template>
  <div>
    <span class="marker">></span>
    <span class="note" :id="`note-${props.note.id}`">{{ props.note.content }}</span>
    <FontAwesomeIcon
      class="keepNoteIcon"
      :icon="faCheck"
      :id="`note-${note.id}-carry`"
      v-if="showActions"
      v-on:click="carry(note.id)"
    />
    <FontAwesomeIcon
      class="removeNoteIcon"
      :icon="faX"
      :id="`note-${note.id}-remove`"
      v-if="showActions"
      v-on:click="remove(note.id)"
    />
  </div>
</template>

<style src="@/components/Note.css" scoped></style>
