import { mount, VueWrapper } from '@vue/test-utils'
import { vi, beforeEach, afterEach } from 'vitest'
import App from "../App.vue";
import { createRouter, createWebHistory, type Router } from "vue-router";
import { routes } from "@/router";
let router: Router = {} as Router;
let app: VueWrapper;

vi.mock("../views/Landing.vue", () => {
  return { default: { template: "<div>I am a fake landing!</div>" } };
});
vi.mock("../views/Notes.vue", () => {
  return { default: { template: "<div>I am a fake notes page!</div>" } };
});

beforeEach(() => {
  router = createRouter({
    history: createWebHistory(),
    routes: routes,
  });
});

afterEach(() => {
  app.unmount();
});

export async function renderLanding() {
  app = mountApp();
  await router.push("/");
  return app;
}

export async function renderNotes() {
  app = mountApp();
  await router.push("/notes");
  return app;
}

function mountApp() {
  return mount(App, {
    global: {
      plugins: [router],
    },
  });
}
