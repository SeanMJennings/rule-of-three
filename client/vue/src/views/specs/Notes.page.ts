import { mount, VueWrapper } from "@vue/test-utils";
import Notes from "../Notes.vue";
import { useMachine } from '@xstate/vue'
import { notesMachine } from '@/state-machines/notes.state-machine'

let page: VueWrapper;
const { snapshot, send, actorRef } = useMachine(notesMachine);
actorRef.start();

export function renderNotesView() {
  page = mountNotesView();
}

export function unmountNotesView() {
  page.unmount();
  send({ type: "reset" });
}

export function stopActor() {
  actorRef.stop();
}

export function pageText() {
  return page.text();
}

export function clickAddNoteListPlaceholder() {
  return elements.addNoteListPlaceholder.trigger("click");
}

export function clickNotesListCaret() {
  return elements.notesListCaret.trigger("click");
}

export function clickNotesListSingleSelectCaret() {
  return elements.notesListSelectCaret.trigger("click");
}

export function typeNoteListName(value: string) {
  return elements.addNoteListInput.setValue(value);
}

export function noteListNameInputText() {
  return (elements.addNoteListInput.element as HTMLInputElement).value;
}

export function noteListSingleSelectHidden() {
  return !elements.queryNoteListSingleSelect().exists();
}

export function noteListSingleSelectChosenValue() {
  return elements.noteListSingleSelect.value;
}

export function addNoteListSubmit() {
  return elements.addNoteListSubmit.trigger("click");
}

export async function clickAddFirstNote() {
  await elements.addFirstNote.trigger("click");
}

export async function addANoteList() {
  await clickAddNoteListPlaceholder();
  await typeNoteListName("Test Note List");
  await addNoteListSubmit();
}

export async function toggleNotesListInput() {
  await clickNotesListCaret();
}

export async function toggleNotesListSingleSelect() {
  await clickNotesListSingleSelectCaret();
}

export async function addAnotherNoteList() {
  await typeNoteListName("Test Note List 2");
  await addNoteListSubmit();
}

export function notesListInputCollapsed() {
  return !elements.addNoteListInput.exists();
}

export function notesListSingleSelectCollapsed() {
  return !elements.queryNoteListSingleSelect().exists();
}

export function notesListSingleSelectCaretPointsDown() {
  return !elements.notesListSelectCaret.classes().includes("fa-rotate-180");
}

export function notesListInputCaretPointsDown() {
  return !elements.notesListCaret.classes().includes("fa-rotate-180");
}

export function notesListInputCaretPointsUp() {
  return !notesListInputCaretPointsDown();
}

export function addFirstNoteHidden() {
  return !elements.addFirstNote.exists();
}

export function noteCountHidden() {
  return !elements.noteCount.exists();
}

export function noteCount() {
  return elements.noteCount.text();
}

export function addNoteVisible() {
  return elements.addNote.exists();
}

export function typeNote(note: string) {
  return elements.addNoteInput.setValue(note);
}
export function addNote() {
  return elements.addNoteSubmit.trigger("click");
}

export function noteListVisible(name: string) {
  return elements.addNoteListInput.text() === name;
}

export function noteVisible(noteId: string | number, note: string) {
  return elements.noteId(noteId).text() === note;
}

export function noteListCharacterCount() {
  return elements.noteListCharacterCount.text();
}

export function characterCount() {
  return elements.characterCount.text();
}

export function noteListCharacterCountHidden() {
  return elements.noteListCharacterCount.text() === "";
}

export function characterCountHidden() {
  return elements.characterCount.text() === "";
}

export async function carryNote(noteId: string | number) {
  return elements.noteCarry(noteId).trigger("click");
}

export async function tickNote(noteId: string | number) {
  return elements.noteTick(noteId).trigger("click");
}

export async function removeNote(noteId: string | number) {
  return elements.noteRemove(noteId).trigger("click");
}

export function tickNoteHidden(noteId: string | number) {
  return !elements.noteTick(noteId).exists();
}

export function carryNoteHidden(noteId: string | number) {
  return !elements.noteCarry(noteId).exists();
}

export function notePageNumber(noteId: string | number) {
  return elements.notePage(noteId).text();
}

export function removeNoteHidden(noteId: string | number) {
  return !elements.noteRemove(noteId).exists();
}

function mountNotesView() {
  return mount(Notes, {
    props: {
      notesMachineProvider: () => {
        return { snapshot: snapshot as any, send, actorRef };
      }
    }
  });
}

const elements = {
  get addNoteListPlaceholder() {
    return page.find("#add-note-list-placeholder");
  },
  get notesListCaret() {
    return page.find("#notes-list-input-caret");
  },
  get notesListSelectCaret() {
    return page.find("#notes-list-select-caret");
  },
  get addNoteListInput() {
    return page.find("#add-note-list-input");
  },
  get addNoteListSubmit() {
    return page.find("#add-note-list-submit");
  },
  get noteListSingleSelect() {
    return page.find("#note-list-single-select").element as HTMLSelectElement;
  },
  queryNoteListSingleSelect() {
    return page.find("#note-list-single-select");
  },
  get addFirstNote() {
    return page.find("#add-first-note");
  },
  get noteCount() {
    return page.find("#note-count");
  },
  get addNote() {
    return page.find("#add-note");
  },
  get addNoteInput() {
    return page.find("#add-note-input");
  },
  get addNoteSubmit() {
    return page.find("#add-note-submit");
  },
  get noteListCharacterCount() {
    return page.find("#notes-list-character-count");
  },  
  get characterCount() {
    return page.find("#character-count");
  },
  noteId(noteId: string | number) {
    return page.find(`#note-${noteId}`);
  },
  noteTick(noteId: string | number) {
    return page.find(`#note-${noteId}-tick`);
  },  
  noteCarry(noteId: string | number) {
    return page.find(`#note-${noteId}-carry`);
  },
  noteRemove(noteId: string | number) {
    return page.find(`#note-${noteId}-remove`);
  },
  notePage(noteId: string | number) {
    return page.find(`#note-${noteId}-page`);
  },
};
