import { expect } from 'vitest'
import { render } from '@/specs/App.page'

export async function renders_login_page() {
  const wrapper = await render()
  expect(wrapper.text()).toContain('I am a fake login!')
}
