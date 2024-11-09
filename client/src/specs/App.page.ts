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

export async function navigateToTasks() {
    await elements.tasksLink.trigger("click");
}

export async function navigateToTasksViaRouter() {
    await router.push("/tasks");
}

export async function navigateToTasksLinkVisible() {
    return elements.tasksLink.isVisible();
}

export async function navigateToLanding() {
    await router.push("/");
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
    },
    get tasksLink() {
        return app.find("#tasks-link");
    }
}