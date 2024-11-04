import {mount, VueWrapper} from '@vue/test-utils'
import {afterEach, beforeEach, vi} from 'vitest'
import App from "../App.vue";
import {createRouter, createWebHistory, type Router} from "vue-router";
import {routes} from "@/router";
import ErroringComponent from "@/testing/ErroringComponent.vue";

let router: Router = {} as Router;
let app: VueWrapper;

// @ts-ignore
HTMLCanvasElement.prototype.getContext = () => {};

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
    router.addRoute(    {
        path: "/wibble",
        component: ErroringComponent,
    },)
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

export async function renders_erroring_app() {
    app = mountApp();
    await router.push("/wibble");
    return app;
}

export function the_route() {
    return router.currentRoute.value.fullPath;
}

export async function login() {
    await elements.login.trigger("click")
}

export async function logout() {
    await elements.logout.trigger("click")
}

export function loginExists() {
    return elements.login.exists();
}

export function logoutExists() {
    return elements.logout.exists();
}

function mountApp() {
    return mount(App, {
        global: {
            plugins: [router]
        }
    });
}

const elements = {
    get login() {
        return app.find("#login");
    },
    get logout() {
        return app.find("#logout");
    }
}