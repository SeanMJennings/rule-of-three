import { describe, it } from 'vitest'
import { lets_user_add_first_note, renders_notes } from '@/views/specs/Notes.steps'

describe('Notes', () => {
  it('renders notes', renders_notes)
  it('lets user add first note', lets_user_add_first_note)
})
