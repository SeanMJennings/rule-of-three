import { describe, it } from 'vitest'
import {
  adds_and_lists_a_note,
  character_count_limit_hidden_when_input_is_empty,
  disables_add_note_button_when_input_is_empty,
  displays_character_count_limit,
  limits_note_length_to_150_characters,
  removes_add_first_note_placeholder_on_click,
  renders_notes
} from '@/views/specs/Notes.steps'

describe('Notes', () => {
  it('renders notes', renders_notes)
  it('removes add first note placeholder on click', removes_add_first_note_placeholder_on_click)
  it('disables add note button when input is empty', disables_add_note_button_when_input_is_empty)
  it('adds and lists a note', adds_and_lists_a_note)
  it('limits note length to 150 characters', limits_note_length_to_150_characters)
  it('displays character count limit', displays_character_count_limit)
  it(
    'character count limit hidden when input is empty',
    character_count_limit_hidden_when_input_is_empty
  )
})
