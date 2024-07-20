import type { Note, Notes } from "@/types/types";
import type { StateValue } from "xstate";
import { NotesMachineCombinedStates } from "@/state-machines/notes.states";
import { noteLimit } from "@/state-machines/notes.state-machine";

export const getNextNoteId = function (notes: Notes) {
  let maxValue = 0;

  notes.map((el) => {
    const valueFromObject = el.id;
    maxValue = Math.max(maxValue, valueFromObject);
  });
  return maxValue === 0 ? 1 : maxValue + 1;
};

export const ReadyToAddNotes = (value: StateValue) => {
  return (
    value !== NotesMachineCombinedStates.empty &&
    value !== NotesMachineCombinedStates.readyToAddNotesLists
  );
};

export const notesAreFull = function (context: { notes: Notes }) {
  return context.notes.length >= noteLimit;
};

export const notesAreEmpty = function (context: { notes: Notes }) {
  return context.notes.length === 0;
};

export const notesHaveBeenCarried = function (context: {
  notes: Notes;
}): boolean {
  return context.notes.filter((n) => !n.carried).length === 0;
};

export const canCarryNote = function (note: Note): boolean {
  return note.page <= 1;
};
