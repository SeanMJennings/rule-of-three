import { notesMachine } from "@/state-machines/notes.state-machine";
import { afterEach, beforeEach, expect } from "vitest";
import { createActor } from "xstate";
import { NotesMachineCombinedStates } from "@/state-machines/notes.states";

let notes = createActor(notesMachine);

beforeEach(() => {
  notes = createActor(notesMachine);
  notes.start();
});

afterEach(() => {
  notes.stop();
});

export function adds_a_note_list() {
  notes.send({ type: "readyToAddFirstNoteList" });
  notes.send({ type: "addNotesList", id: 1, name: "Note list name" });
  expect(notes.getSnapshot().value).toEqual(
    NotesMachineCombinedStates.addingNotesListsEmpty,
  );
  expect(notes.getSnapshot().context.id).toEqual(1);
  expect(notes.getSnapshot().context.name).toEqual("Note list name");
  expect(notes.getSnapshot().context.notes).toEqual([]);
}

export function updates_a_note_list_name() {
  notes.send({ type: "readyToAddFirstNoteList" });
  notes.send({ type: "addNotesList", id: 1, name: "Note list name" });
  notes.send({ type: "updateNotesList", name: "New note list name" });
  expect(notes.getSnapshot().value).toEqual(
    NotesMachineCombinedStates.addingNotesListsEmpty,
  );
  expect(notes.getSnapshot().context.id).toEqual(1);
  expect(notes.getSnapshot().context.name).toEqual("New note list name");
  expect(notes.getSnapshot().context.notes).toEqual([]);
}

export function adds_a_note() {
  notes.send({ type: "readyToAddFirstNoteList" });
  notes.send({ type: "addNotesList", id: 1, name: "Note list name" });
  notes.send({ type: "readyToAddFirstNote" });
  notes.send({ type: "add", content: "Note content" });
  expect(notes.getSnapshot().value).toEqual(
    NotesMachineCombinedStates.addingNotesListsAddingNotes,
  );
  expect(notes.getSnapshot().context.notes).toEqual([
    { id: 1, content: "Note content", carried: false, page: 0 },
  ]);
}

export function selects_a_different_notes_list() {
  notes.send({ type: "readyToAddFirstNoteList" });
  notes.send({ type: "addNotesList", id: 1, name: "Note list name" });
  notes.send({ type: "readyToAddFirstNote" });
  notes.send({ type: "add", content: "Note content" });
  notes.send({ type: "selectNotesList", id: 2, name: "2nd note list name" });
  expect(notes.getSnapshot().value).toEqual(
    NotesMachineCombinedStates.addingNotesListsEmpty,
  );
  expect(notes.getSnapshot().context.id).toEqual(2);
  expect(notes.getSnapshot().context.name).toEqual("2nd note list name");
  expect(notes.getSnapshot().context.notes).toEqual([]);
}

export function adds_22_notes_and_then_refuses_subsequent_notes() {
  notes.send({ type: "readyToAddFirstNoteList" });
  notes.send({ type: "addNotesList", id: 1, name: "Note list name" });
  notes.send({ type: "readyToAddFirstNote" });
  for (let i = 0; i < 22; i++) {
    notes.send({ type: "add", content: "Note content", page: 0 });
  }
  expect(notes.getSnapshot().context.notes.length).toEqual(22);
  expect(notes.getSnapshot().value).toEqual(
    NotesMachineCombinedStates.addingNotesListsChoosingNotesToCarry,
  );
}

export function lets_user_carry_notes() {
  notes.send({ type: "readyToAddFirstNoteList" });
  notes.send({ type: "addNotesList", id: 1, name: "Note list name" });
  notes.send({ type: "readyToAddFirstNote" });
  for (let i = 0; i < 22; i++) {
    notes.send({ type: "add", content: "Note content" });
  }
  for (let i = 0; i < 22; i++) {
    notes.send({ type: "carry", id: i + 1 });
  }
  expect(
    notes.getSnapshot().context.notes.filter((n) => n.page === 1).length,
  ).toEqual(22);
  expect(
    notes.getSnapshot().context.notes.filter((n) => n.carried === false).length,
  ).toEqual(22);
  expect(notes.getSnapshot().value).toEqual(
    NotesMachineCombinedStates.addingNotesListsChoosingNotesToCarry,
  );
}

export function lets_user_remove_notes() {
  notes.send({ type: "readyToAddFirstNoteList" });
  notes.send({ type: "addNotesList", id: 1, name: "Note list name" });
  notes.send({ type: "readyToAddFirstNote" });
  for (let i = 0; i < 22; i++) {
    notes.send({ type: "add", content: "Note content" });
  }
  for (let i = 0; i < 22; i++) {
    notes.send({ type: "remove", id: i + 1 });
  }
  expect(notes.getSnapshot().context.notes.length).toEqual(0);
  expect(notes.getSnapshot().value).toEqual(
    NotesMachineCombinedStates.addingNotesListsAddingNotes,
  );
}

export function lets_user_carry_notes_maximum_twice() {
  notes.send({ type: "readyToAddFirstNoteList" });
  notes.send({ type: "addNotesList", id: 1, name: "Note list name" });
  notes.send({ type: "readyToAddFirstNote" });
  for (let i = 0; i < 22; i++) {
    notes.send({ type: "add", content: "Note content" });
  }
  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < 22; i++) {
      notes.send({ type: "carry", id: i + 1 });
    }
  }
  expect(
    notes.getSnapshot().context.notes.filter((n) => n.page === 2).length,
  ).toEqual(22);
  expect(
    notes.getSnapshot().context.notes.filter((n) => n.carried === false).length,
  ).toEqual(22);
  expect(notes.getSnapshot().value).toEqual(
    NotesMachineCombinedStates.addingNotesListsChoosingNotesToCarry,
  );
}
