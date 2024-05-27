import { describe, it } from 'vitest'
import { renders_notes } from '@/views/specs/Notes.steps'

describe('Notes', () => {
  it('renders notes', renders_notes)
})
