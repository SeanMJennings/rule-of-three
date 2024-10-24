import {mount, VueWrapper} from '@vue/test-utils'
import {afterEach, beforeEach, vi} from 'vitest'
import App from "../App.vue";
import {createRouter, createWebHistory, type Router} from "vue-router";
import {routes} from "@/router";

let router: Router = {} as Router;
let app: VueWrapper;

vi.mock("../views/Landing.vue", () => {
    return {default: {template: "<div>I am a fake landing!</div>"}};
});
vi.mock("../views/Tasks.vue", () => {
    return {default: {template: "<div>I am a fake tasks page!</div>"}};
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

export async function renderTasks() {
    app = mountApp();
    await router.push("/tasks");
    return app;
}

export async function renderUnknownRoute() {
    app = mountApp();
    await router.push("/unknown");
    return app;
}

export function the_route() {
    return router.currentRoute.value.fullPath;
}

function mountApp() {
    return mount(App, {
        global: {
            plugins: [router],
        },
    });
}
