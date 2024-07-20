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
} from "@/state-machines/specs/notes.state-machine.steps";

describe("Notes state machine", () => {
  describe("Notes lists", () => {
    it("adds a note list", adds_a_note_list);
    it("updates a note list name", updates_a_note_list_name);
    it("selects a different notes list", selects_a_different_notes_list);
  });
  describe("Notes", () => {
    it("adds a note", adds_a_note);
    it(
      "adds 22 notes and then refuses subsequent notes",
      adds_22_notes_and_then_refuses_subsequent_notes,
    );
    it("lets user carry notes", lets_user_carry_notes);
    it("lets user remove notes", lets_user_remove_notes);
    it(
      "lets user carry notes maximum twice",
      lets_user_carry_notes_maximum_twice,
    );
  });
});
