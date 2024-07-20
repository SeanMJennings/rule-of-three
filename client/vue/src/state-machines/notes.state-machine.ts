import { assign, createMachine } from "xstate";
import type { Note, Notes } from "@/types/types";
import {
  canCarryNote,
  getNextNoteId,
  notesAreEmpty,
  notesAreFull,
  notesHaveBeenCarried,
} from "@/state-machines/notes.extensions";
import {
  NotesListMachineStates,
  NotesMachineStates,
} from "@/state-machines/notes.states";
import { store } from "@/state-machines/notes.store";

export const noteLimit = 22;

export const notesMachine = createMachine(
  {
    types: {} as {
      context: { id: number; name: string; notes: Notes };
    },
    context: { id: 0, name: "", notes: [] },
    initial: NotesListMachineStates.empty,
    states: {
      empty: {
        on: {
          readyToAddFirstNoteList: {
            target: NotesListMachineStates.readyToAddNotesLists,
          },
        },
        always: {
          guard: "notesListsExist",
          target: NotesListMachineStates.addingNotesLists,
        },
      },
      readyToAddNotesLists: {
        on: {
          addNotesList: {
            actions: [
              ({ context, event }) => {
                store.send({
                  type: "add",
                  notesList: {
                    id: getNextNoteId(context.notes),
                    name: event.name,
                  },
                });
              },
              assign({
                id: ({ context, event }) => (context.id = event.id),
                name: ({ context, event }) => (context.name = event.name),
              }),
            ],
            target: NotesListMachineStates.addingNotesLists,
          },
        },
      },
      addingNotesLists: {
        initial: NotesMachineStates.empty,
        on: {
          addNotesList: {
            actions: [
              ({ context, event }) => {
                store.send({
                  type: "add",
                  notesList: {
                    id: getNextNoteId(context.notes),
                    name: event.name,
                  },
                });
              },
              assign({
                id: ({ context, event }) => (context.id = event.id),
                name: ({ context, event }) => (context.name = event.name),
              }),
            ],
          },
          updateNotesList: {
            actions: [
              ({ event }) => {
                store.send({
                  type: "update",
                  notesList: { id: event.id, name: event.name },
                });
              },
              assign({
                name: ({ context, event }) => (context.name = event.name),
              }),
            ],
          },
          selectNotesList: {
            actions: assign({
              id: ({ context, event }) => (context.id = event.id),
              name: ({ context, event }) => (context.name = event.name),
              notes: ({ context }) => (context.notes = []),
            }),
            target: NotesListMachineStates.assessingNotesList,
          },
        },
        states: {
          empty: {
            on: {
              readyToAddFirstNote: {
                target: NotesMachineStates.addingNotes,
              },
            },
            always: {
              guard: "notesAreNotEmpty",
              target: NotesMachineStates.addingNotes,
            },
          },
          addingNotes: {
            on: {
              add: {
                actions: assign({
                  notes: ({ context, event }) =>
                    context.notes.concat({
                      id: getNextNoteId(context.notes),
                      content: event.content,
                      carried: false,
                      page: 0,
                    }),
                }),
              },
            },
            always: {
              guard: "notesAreFull",
              target: NotesMachineStates.choosingNotesToCarry,
            },
          },
          choosingNotesToCarry: {
            on: {
              carry: {
                actions: assign({
                  notes: ({ context, event }) => {
                    const note =
                      context.notes.find((note) => note.id === event.id) ??
                      ({} as Note);
                    if (canCarryNote(note)) {
                      note.page += 1;
                      note.carried = true;
                    }
                    return context.notes;
                  },
                }),
              },
              remove: {
                actions: assign({
                  notes: ({ context, event }) => {
                    context.notes = context.notes.filter(
                      (note) => note.id !== event.id,
                    );
                    return context.notes;
                  },
                }),
              },
            },
            always: {
              guard: "notesHaveAllBeenCarried",
              target: NotesMachineStates.addingNotes,
            },
            exit: [
              (context) => {
                context.context.notes = context.context.notes.map((note) => {
                  note.carried = false;
                  return note;
                });
              },
            ],
          },
        },
      },
      assessingNotesList: {
        always: {
          target: NotesListMachineStates.addingNotesLists,
        },
      },
      success: {
        always: NotesListMachineStates.addingNotesLists,
      },
    },
  },
  {
    guards: {
      notesHaveAllBeenCarried: ({ context }) => {
        return notesHaveBeenCarried(context);
      },
      notesAreFull: ({ context }) => {
        return notesAreFull(context);
      },
      notesListsExist: ({ context }) => {
        return context.id !== 0;
      },
      notesAreNotEmpty: ({ context }) => {
        return !notesAreEmpty(context);
      },
    },
  },
);
