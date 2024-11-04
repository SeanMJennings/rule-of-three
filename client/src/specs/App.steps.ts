import {beforeEach, expect, vi} from "vitest";
import {
    login,
    loginExists, logout,
    renderLanding,
    renders_erroring_app,
    renderTasks,
    renderUnknownRoute,
    the_route
} from "@/specs/App.page";
import {mockAuth0, resetAuth0} from "@/testing/mock-auth0";
import {waitUntil} from "@/testing/utilities";


vi.mock('@auth0/auth0-vue', () => ({
    useAuth0: () => mockAuth0
}));

beforeEach(() => {
    resetAuth0();
});

export async function renders_landing_page() {
    const wrapper = await renderLanding();
    expect(wrapper.text()).toContain("I am a fake landing!");
}

export async function renders_login_user_when_not_logged_in() {
    const wrapper = await renderLanding();
    expect(wrapper.text()).toContain("Log in");
}

export async function renders_logout_user_when_logged_in() {
    const wrapper = await renderLanding();
    await login();
    await waitUntil(() => !loginExists());
    expect(wrapper.text()).toContain("Log out");
}

export async function lets_user_log_out() {
    const wrapper = await renderLanding();
    await login();
    await waitUntil(() => !loginExists());
    await logout();
    await waitUntil(loginExists);
    expect(wrapper.text()).toContain("Log in");
}

export async function render_tasks_page_when_user_logged_in() {
    const wrapper = await renderLanding();
    await login();
    await waitUntil(() => !loginExists());
    expect(wrapper.html()).toContain("Tasks");
}

export async function does_not_render_tasks_page_link_when_user_not_logged_in() {
    const wrapper = await renderLanding();
    expect(wrapper.html()).not.toContain("Tasks");
}

export async function renders_landing_page_by_the_default() {
    const wrapper = await renderUnknownRoute();
    expect(wrapper.text()).toContain("I am a fake landing!");
    expect(the_route()).toBe("/");
}

export async function renders_error_boundary_for_uncaught_error() {
    const wrapper = await renders_erroring_app();
    expect(wrapper.text()).toContain("An unknown error occurred");
}
