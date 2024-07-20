export type Id = { id: number };
export type NotesList = Id & {
  name: string;
};
export type Notes = Note[];
export type Note = Id & {
  content: string;
  carried: boolean;
  page: number;
};
