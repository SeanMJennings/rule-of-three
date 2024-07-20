import { describe, it } from "vitest";
import {
  adds_and_lists_a_note,
  asks_user_to_create_first_note_list,
  character_count_limit_hidden_when_input_is_empty,
  disables_add_note_button_when_input_is_empty,
  displays_character_count_limit,
  displays_list_character_count_limit,
  displays_page_number_of_notes, does_not_show_remove_or_carry_for_ticked_notes,
  lets_user_add_a_note_list,
  lets_user_carry_notes,
  lets_user_collapse_notes_list_input,
  lets_user_collapse_notes_list_single_select,
  lets_user_expand_notes_list_input,
  lets_user_expand_notes_list_single_select,
  lets_user_remove_notes, lets_user_tick_notes,
  limits_note_length_to_150_characters,
  list_character_count_limit_hidden_when_input_is_empty,
  only_shows_remove_notes_for_notes_carried_twice,
  removes_add_first_note_placeholder_on_click,
  renders_notes,
  resets_notes_when_different_notes_list_selected,
  shows_note_count_if_there_are_notes,
  shows_note_list_single_select_when_there_are_two_lists
} from '@/views/specs/Notes.steps'

describe("Notes", () => {
  describe("Note List", () => {
    it("asks user to create first note list",asks_user_to_create_first_note_list);
    it("lets user add a note list", lets_user_add_a_note_list);
    it("displays list character count limit", displays_list_character_count_limit);
    it("list character count limit hidden when input is empty", list_character_count_limit_hidden_when_input_is_empty);
    it('lets user collapse notes list input', lets_user_collapse_notes_list_input);
    it('lets user expand notes list input', lets_user_expand_notes_list_input);
    it("shows note list single select when there are two lists", shows_note_list_single_select_when_there_are_two_lists);
    it('lets user collapse notes list single select', lets_user_collapse_notes_list_single_select);
    it('lets user expand notes list single select', lets_user_expand_notes_list_single_select);
  });
  describe("Notes", () => {
    it("renders notes", renders_notes);
    it("removes add first note placeholder on click", removes_add_first_note_placeholder_on_click);
    it("disables add note button when input is empty", disables_add_note_button_when_input_is_empty);
    it("adds and lists a note", adds_and_lists_a_note);
    it("shows note count if there are notes", shows_note_count_if_there_are_notes);
    it("limits note length to 150 characters", limits_note_length_to_150_characters);
    it("displays character count limit", displays_character_count_limit);
    it("character count limit hidden when input is empty", character_count_limit_hidden_when_input_is_empty);
    it("lets user tick notes", lets_user_tick_notes);
    it("lets user carry notes", lets_user_carry_notes);
    it("lets user remove notes", lets_user_remove_notes);
    it("displays page number of notes", displays_page_number_of_notes);
    it("does not show remove or carry for ticked notes", does_not_show_remove_or_carry_for_ticked_notes);
    it("only shows remove notes for notes carried twice", only_shows_remove_notes_for_notes_carried_twice);
    it('reset notes when different notes list selected',resets_notes_when_different_notes_list_selected)
  });
});
