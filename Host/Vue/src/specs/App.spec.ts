import { describe, it } from 'vitest'
import { renders_login_page } from '@/specs/App.steps'

describe('App', () => {
  it('renders login page', renders_login_page)
})
