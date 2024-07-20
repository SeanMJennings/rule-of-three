<script setup lang="ts">
import { type Note } from "@/types/types";
import { faArrowRight, faCheck, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import style from "./Note.module.css";

const props = defineProps<{
  note: Note;
  showTickAction: boolean;
  showCarryAction: boolean;
  showRemoveAction: boolean;
  choosingNotesToCarry: boolean;
  tick: (id: string | number) => void;
  carry: (id: string | number) => void;
  remove: (id: string | number) => void;
}>();

</script>

<template>
  <div :class="style.div">
    <span :class="style.marker">></span>
    <span :class="`${note.ticked ? style.noteTicked : !showTickAction && props.note.carried ? style.noteKept : ''} ${style.note}`" :id="`note-${props.note.id}`">{{props.note.content }}</span>
    <span :class="style.page" :id="`note-${props.note.id}-page`">{{props.note.page }}</span>
    <div v-if="!showRemoveAction && !showCarryAction && !showTickAction" :class="`${choosingNotesToCarry ? style.largeSpacer : style.spacer}`"/>
    <FontAwesomeIcon :class="style.icon" :icon="faCheck" :id="`note-${props.note.id}-tick`" v-if="showTickAction" v-on:click="tick(props.note.id)"/>
    <FontAwesomeIcon :class="style.icon" :icon="faArrowRight" :id="`note-${props.note.id}-carry`" v-if="showCarryAction" v-on:click="carry(props.note.id)"/>
    <FontAwesomeIcon :class="`${showCarryAction ? style.carryActionShown : ''} ${style.icon}`" :icon="faX" :id="`note-${props.note.id}-remove`" v-if="showRemoveAction" v-on:click="remove(props.note.id)"/>
  </div>
</template>
