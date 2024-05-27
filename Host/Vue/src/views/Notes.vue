<script setup lang="ts">
import { notesStore } from '@/stores/notes-store'
</script>

<template>
  <main>
    <div class="container">
      <div class="addFirstNote" v-if="notesStore.getSnapshot().context.notes.length === 0">
        Add your first note
      </div>
    </div>
  </main>
</template>

<style src="@/Views/Notes.css" scoped></style>
