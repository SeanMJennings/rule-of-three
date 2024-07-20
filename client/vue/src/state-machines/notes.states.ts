export const enum NotesListMachineStates {
  empty = "empty",
  readyToAddNotesLists = "readyToAddNotesLists",
  addingNotesLists = "addingNotesLists",
  assessingNotesList = "assessingNotesList",
}

export const enum NotesMachineStates {
  empty = "empty",
  addingNotes = "addingNotes",
  choosingNotesToCarry = "choosingNotesToCarry",
}

export const NotesMachineCombinedStates = {
  empty: NotesListMachineStates.empty,
  readyToAddNotesLists: NotesListMachineStates.readyToAddNotesLists,
  addingNotesListsEmpty: { addingNotesLists: NotesMachineStates.empty },
  addingNotesListsAddingNotes: {
    addingNotesLists: NotesMachineStates.addingNotes,
  },
  addingNotesListsChoosingNotesToCarry: {
    addingNotesLists: NotesMachineStates.choosingNotesToCarry,
  },
};
