import { assign, createMachine } from "xstate";
import type { Note, Notes, NotesList } from '@/types/types'
import {
  canCarryNote,
  getNextNoteId, getNextNoteListId,
  notesAreEmpty,
  notesAreFull,
  notesHaveBeenCarried
} from '@/state-machines/notes.extensions'
import {
  NotesListMachineStates,
  NotesMachineStates,
} from "@/state-machines/notes.states";

export const noteLimit = 22;

export const notesMachine = createMachine(
  {
    types: {} as {
      context: { id: number; name: string; notes: Notes, notesLists: NotesList[] };
    },
    context: { id: 0, name: "", notes: [], notesLists: [] as NotesList[]},
    on: {
      reset: {
        target: `.${NotesListMachineStates.empty}`,
        actions: assign({ id: 0, name: "", notes: [], notesLists: [] as NotesList[]})
      }
    },
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
              assign({
                id: ({ context }) => (context.id = getNextNoteListId(context.notesLists)),
                name: ({ context, event }) => (context.name = event.name),
                notesLists: ({ context }) => context.notesLists.concat({id: context.id, name: context.name,}),
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
              assign({
                id: ({ context }) => (context.id = getNextNoteListId(context.notesLists)),
                name: ({ context, event }) => (context.name = event.name),
                notesLists: ({ context }) => context.notesLists.concat({id: context.id, name: context.name,}),
              }),
            ],
          },
          updateNotesList: {
            actions: [
              assign({
                name: ({ context, event }) => (context.name = event.name),
                notesLists: ({ context, event }) => context.notesLists.map((list) => {
                  if (list.id === event.id) {
                    list.name = event.name;
                  }
                  return list;
                })
              }),
            ],
          },
          selectNotesList: {
            actions: assign({
              id: ({ context, event }) => {
                if (context.notesLists.find((list) => list.id === event.id) === undefined) return context.id;
                return (context.id = event.id)
              },
              name: ({ context, event }) => {
                const name = context.notesLists.find((list) => list.id === event.id)?.name;
                if (name === undefined) return context.name;
                return (context.name = name)
              },
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
                    context.notes.concat({id: getNextNoteId(context.notes), content: event.content, carried: false, page: 0, ticked: false}),
                }),
              },
              tick: {
                actions: assign({
                  notes: ({ context, event }) => {
                    const note = context.notes.find((note) => note.id === event.id) ?? ({} as Note);
                    note.ticked = true;
                    return context.notes;
                  },
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
                    const note = context.notes.find((note) => note.id === event.id) ?? ({} as Note);
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
                    context.notes = context.notes.filter((note) => note.id !== event.id,);
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
                context.context.notes = context.context.notes.filter((note) => !note.ticked).map((note) => {
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
        always: { 
          target: NotesListMachineStates.addingNotesLists
        },
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