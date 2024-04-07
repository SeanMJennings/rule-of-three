import { mount } from '@vue/test-utils'
import { vi } from 'vitest'
import App from '../App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'
const LoginMock = {
  template: '<div>I am a fake login!</div>'
}

vi.mock('@/views/LoginView')

const router = createRouter({
  history: createWebHistory(),
  routes: routes
})

export async function render() {
  await router.push('/')

  await router.isReady()
  return mount(App, {
    global: {
      plugins: [router],
      stubs: {
        LoginView: LoginMock
      }
    }
  })
}
