<script setup lang="ts">
import { type Note } from '@/types/types'
import { faCheck, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import style from './Note.module.css'
const props = defineProps<{
  note: Note
  showCarryAction: boolean
  showRemoveAction: boolean
  carry: (id: string | number) => void
  remove: (id: string | number) => void
}>()
</script>

<template>
  <div :class=style.div>
    <span :class=style.marker>></span>
    <span :class=style.note :id="`note-${props.note.id}`">{{ props.note.content }}</span>
    <span :class=style.page :id="`note-${props.note.id}-page`">{{ props.note.page }}</span>
    <FontAwesomeIcon
      :class=style.keepNoteIcon
      :icon="faCheck"
      :id="`note-${note.id}-carry`"
      v-if="showCarryAction"
      v-on:click="carry(note.id)"
    />
    <FontAwesomeIcon
      :class="`${showCarryAction ? style.carryActionShown : ''} ${style.removeNoteIcon}`"
      :icon="faX"
      :id="`note-${note.id}-remove`"
      v-if="showRemoveAction"
      v-on:click="remove(note.id)"
    />
  </div>
</template>

<style src="@/components/Note.module.css" scoped></style>
