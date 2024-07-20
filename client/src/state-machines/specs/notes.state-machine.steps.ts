import { notesMachine } from "@/state-machines/notes.state-machine";
import { afterAll, afterEach, expect } from 'vitest'
import { createActor } from 'xstate'
import { NotesMachineCombinedStates } from "@/state-machines/notes.states";

const notes = createActor(notesMachine);
notes.start();

afterEach(() => {
  notes.send({ type: "reset" })
});

afterAll(() => {
  notes.stop();
});

export function adds_a_note_list() {
  notes.send({ type: "readyToAddFirstNoteList" });
  notes.send({ type: "addNotesList", id: 1, name: "Note list name" });
  expect(notes.getSnapshot().value).toEqual(NotesMachineCombinedStates.addingNotesListsEmpty);
  expect(notes.getSnapshot().context.id).toEqual(1);
  expect(notes.getSnapshot().context.name).toEqual("Note list name");
  expect(notes.getSnapshot().context.notes).toEqual([]);
  expect(notes.getSnapshot().context.notesLists).toEqual([{id: 1, name: "Note list name" }]);
}

export function updates_a_note_list_name() {
  notes.send({ type: "readyToAddFirstNoteList" });
  notes.send({ type: "addNotesList", id: 1, name: "Note list name" });
  notes.send({ type: "updateNotesList", id: 1, name: "New note list name" });
  expect(notes.getSnapshot().value).toEqual(NotesMachineCombinedStates.addingNotesListsEmpty);
  expect(notes.getSnapshot().context.id).toEqual(1);
  expect(notes.getSnapshot().context.name).toEqual("New note list name");
  expect(notes.getSnapshot().context.notes).toEqual([]);
  expect(notes.getSnapshot().context.notesLists).toEqual([{id: 1, name: "New note list name" }]);
}

export function adds_a_note() {
  notes.send({ type: "readyToAddFirstNoteList" });
  notes.send({ type: "addNotesList", id: 1, name: "Note list name" });
  notes.send({ type: "readyToAddFirstNote" });
  notes.send({ type: "add", content: "Note content" });
  expect(notes.getSnapshot().value).toEqual(NotesMachineCombinedStates.addingNotesListsAddingNotes);
  expect(notes.getSnapshot().context.notes).toEqual([{ id: 1, content: "Note content", carried: false, page: 0, ticked: false }]);
}

export function lets_user_tick_off_note() {
  notes.send({ type: "readyToAddFirstNoteList" });
  notes.send({ type: "addNotesList", id: 1, name: "Note list name" });
  notes.send({ type: "readyToAddFirstNote" });
  notes.send({ type: "add", content: "Note content" });
  notes.send({ type: "tick", id: 1 });
  expect(notes.getSnapshot().value).toEqual(NotesMachineCombinedStates.addingNotesListsAddingNotes);
  expect(notes.getSnapshot().context.notes).toEqual([{ id: 1, content: "Note content", carried: false, page: 0, ticked: true }]);
}

export async function selects_a_different_notes_list() {
  notes.send({ type: "readyToAddFirstNoteList" });
  notes.send({ type: "addNotesList", id: 1, name: "Note list name" });
  notes.send({ type: "readyToAddFirstNote" });
  notes.send({ type: "add", content: "Note content" });
  notes.send({ type: "addNotesList", id: 2, name: "2nd note list name" });
  notes.send({ type: "selectNotesList", id: 2 });
  expect(notes.getSnapshot().value).toEqual(NotesMachineCombinedStates.addingNotesListsEmpty);

  expect(notes.getSnapshot().context.id).toEqual(2);
  expect(notes.getSnapshot().context.name).toEqual("2nd note list name");
  expect(notes.getSnapshot().context.notes).toEqual([]);
  expect(notes.getSnapshot().context.notesLists).toEqual([
    { id: 1, name: "Note list name" },
    { id: 2, name: "2nd note list name" },
  ]);
}

export function adds_22_notes_and_then_refuses_subsequent_notes() {
  notes.send({ type: "readyToAddFirstNoteList" });
  notes.send({ type: "addNotesList", id: 1, name: "Note list name" });
  notes.send({ type: "readyToAddFirstNote" });
  for (let i = 0; i < 22; i++) {
    notes.send({ type: "add", content: "Note content", page: 0 });
  }
  expect(notes.getSnapshot().context.notes.length).toEqual(22);
  expect(notes.getSnapshot().value).toStrictEqual(NotesMachineCombinedStates.addingNotesListsChoosingNotesToCarry);
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
  expect(notes.getSnapshot().context.notes.filter((n) => n.page === 1).length).toEqual(22);
  expect(notes.getSnapshot().context.notes.filter((n) => n.carried === false).length).toEqual(22);
  expect(notes.getSnapshot().value).toEqual(NotesMachineCombinedStates.addingNotesListsChoosingNotesToCarry);
}

export function removes_ticked_notes_when_all_notes_are_carried() {
  notes.send({ type: "readyToAddFirstNoteList" });
  notes.send({ type: "addNotesList", id: 1, name: "Note list name" });
  notes.send({ type: "readyToAddFirstNote" });
  for (let i = 0; i < 20; i++) {
    notes.send({ type: "add", content: "Note content" });
  }
  notes.send({ type: "tick", id: 19 });
  notes.send({ type: "tick", id: 20 });
  notes.send({ type: "add", content: "Note content" });
  notes.send({ type: "add", content: "Note content" });

  for (let i = 0; i < 22; i++) {
    notes.send({ type: "carry", id: i + 1 });
  }
  
  expect(notes.getSnapshot().context.notes.length).toEqual(20);
  expect(notes.getSnapshot().context.notes.filter((n) => n.page === 1).length).toEqual(20);
  expect(notes.getSnapshot().context.notes.filter((n) => n.carried === false).length).toEqual(20);
  expect(notes.getSnapshot().value).toEqual(NotesMachineCombinedStates.addingNotesListsAddingNotes);
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
  expect(notes.getSnapshot().value).toEqual(NotesMachineCombinedStates.addingNotesListsAddingNotes);
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
  expect(notes.getSnapshot().context.notes.filter((n) => n.page === 2).length).toEqual(22);
  expect(notes.getSnapshot().context.notes.filter((n) => n.carried === false).length).toEqual(22);
  expect(notes.getSnapshot().value).toEqual(NotesMachineCombinedStates.addingNotesListsChoosingNotesToCarry);
}

export function selecting_a_notes_list_resets_the_notes() {
  notes.send({ type: "readyToAddFirstNoteList" });
  notes.send({ type: "addNotesList", id: 1, name: "Note list name" });
  notes.send({ type: "addNotesList", id: 2, name: "2nd note list name" });
  notes.send({ type: "readyToAddFirstNote" });
  for (let i = 0; i < 22; i++) {
    notes.send({ type: "add", content: "Note content" });
  }
  notes.send({ type: "selectNotesList", id: 2 });

  expect(notes.getSnapshot().context.notes.length).toEqual(0);
}
