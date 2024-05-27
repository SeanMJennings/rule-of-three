import { describe, it } from 'vitest'
import { allows_adding_a_note } from '@/stores/specs/notes-store.steps'

describe('Notes Store', () => {
  it('allows adding a note', allows_adding_a_note)
})
