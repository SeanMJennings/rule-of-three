import { describe, it } from 'vitest'
import { renders_landing_page, render_notes_page } from '@/specs/App.steps'

describe('App', () => {
  it('renders landing page', renders_landing_page)
  it('renders notes page', render_notes_page)
})
