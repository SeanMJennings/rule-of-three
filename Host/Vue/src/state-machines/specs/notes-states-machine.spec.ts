import { describe, it } from 'vitest'
import { adds_a_note } from '@/state-machines/specs/notes-state-machine.steps'

describe('Notes state machine', () => {
  it('adds a note', adds_a_note)
})
