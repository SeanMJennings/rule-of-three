<script setup lang="ts">
import { defineProps } from 'vue'
import { type Note } from '@/types/types'
const props = defineProps<{
  note: Note
}>()
</script>

<template>
  <div>{{ props.note.content }}</div>
</template>

<style src="@/components/Note.css" scoped></style>
