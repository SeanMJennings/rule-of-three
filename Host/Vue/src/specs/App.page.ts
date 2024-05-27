import { mount, flushPromises  } from '@vue/test-utils'
import { vi, beforeEach } from 'vitest'
import App from '../App.vue'
import { createRouter, createWebHistory, type Router } from 'vue-router'
import { routes } from '@/router'
let router: Router = {} as Router

vi.mock('../views/Landing.vue', 
    () => { return { default: { template: '<div>I am a fake landing!</div>' }}})
vi.mock('../views/Notes.vue', 
    () => { return { default: { template: '<div>I am a fake notes page!</div>' }}})

beforeEach(() => {
  router = createRouter({
    history: createWebHistory(),
    routes: routes
  })
})

export async function renderLanding() {
  const app = mountApp()
  await router.push('/')
  return app
}

export async function renderNotes() {
  const app = mountApp()
  await router.isReady()
  await router.push('/notes')
  await flushPromises()
  return app
}

function mountApp() {
  return mount(App, {
    global: {
      plugins: [router]
    }
  })
}
