import { describe, it } from "vitest";
import {
  adds_22_notes_and_then_refuses_subsequent_notes,
  adds_a_note,
  adds_a_note_list,
  updates_a_note_list_name,
  lets_user_carry_notes,
  lets_user_carry_notes_maximum_twice,
  lets_user_remove_notes,
  selects_a_different_notes_list,
  selecting_a_notes_list_resets_the_notes,
  lets_user_tick_off_note,
  removes_ticked_notes_when_all_notes_are_carried
} from '@/state-machines/specs/notes.state-machine.steps'

describe("Notes state machine", () => {
  describe("Notes lists", () => {
    it("adds a note list", adds_a_note_list);
    it("updates a note list name", updates_a_note_list_name);
    it("selects a different notes list", selects_a_different_notes_list);
  });
  describe("Notes", () => {
    it("adds a note", adds_a_note);
    it("lets user tick off note", lets_user_tick_off_note);
    it("adds 22 notes and then refuses subsequent notes", adds_22_notes_and_then_refuses_subsequent_notes);
    it("lets user carry notes", lets_user_carry_notes);
    it('removes ticked notes when all notes are carried', removes_ticked_notes_when_all_notes_are_carried);
    it("lets user remove notes", lets_user_remove_notes);
    it("lets user carry notes maximum twice", lets_user_carry_notes_maximum_twice);
    it("selecting a notes list resets the notes", selecting_a_notes_list_resets_the_notes);
  });
});
