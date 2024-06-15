import { describe, it } from 'vitest'
import {
  adds_22_notes_and_then_refuses_subsequent_notes,
  adds_a_note,
  lets_user_carry_notes,
  lets_user_carry_notes_maximum_twice,
  lets_user_remove_notes
} from '@/state-machines/specs/notes-state-machine.steps'

describe('Notes state machine', () => {
  it('adds a note', adds_a_note)
  it(
    'adds 22 notes and then refuses subsequent notes',
    adds_22_notes_and_then_refuses_subsequent_notes
  )
  it('lets user carry notes', lets_user_carry_notes)
  it('lets user remove notes', lets_user_remove_notes)
  it('lets user carry notes maximum twice', lets_user_carry_notes_maximum_twice)
})
