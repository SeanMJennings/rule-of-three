import { createStore } from "@xstate/store";
import type { NotesList } from "@/types/types";

export const store = createStore(
  { notesLists: [] as NotesList[] },
  {
    add: {
      notesLists: (context, event: { notesList: NotesList }) => {
        return context.notesLists.concat(event.notesList);
      },
    },
    update: {
      notesLists: (context, event: { notesList: NotesList }) => {
        return context.notesLists.map((list) => {
          if (list.id === event.notesList.id) {
            list.name = event.notesList.name;
          }
          return list;
        });
      },
    },
  },
);

export const subscribeToStore = (callback: (state: any) => void) => {
  store.subscribe(callback);
};

export const getNotesLists = () => {
  return store.getSnapshot().context.notesLists;
};
