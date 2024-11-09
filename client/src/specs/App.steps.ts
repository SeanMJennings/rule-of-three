import {beforeEach, expect, vi} from "vitest";
import {
    login,
    loginExists, logout, navigateToLanding, navigateToTasks, navigateToTasksLinkVisible, navigateToTasksViaRouter,
    renderLanding,
    renders_erroring_app,
    renderUnknownRoute,
    the_route
} from "@/specs/App.page";
import {change_token, mockAuth0, resetAuth0, theTokenString, userIsAuthenticated} from "@/testing/mock-auth0";
import {waitUntil} from "@/testing/utilities";


vi.mock('@auth0/auth0-vue', () => ({
    useAuth0: () => mockAuth0,
    authGuard: () => userIsAuthenticated()
}));

beforeEach(() => {
    resetAuth0();
    window.token = undefined;
});

export async function renders_landing_page() {
    const wrapper = await renderLanding();
    expect(wrapper.text()).toContain("A simple approach");
}

export async function renders_login_user_when_not_logged_in() {
    const wrapper = await renderLanding();
    expect(wrapper.text()).toContain("Log in");
}

export async function renders_logout_user_when_logged_in() {
    const wrapper = await renderLanding();
    await login();
    await waitUntil(() => !loginExists());
    expect(window.token).toBe(theTokenString);
    expect(wrapper.text()).toContain("Log out");
}

export async function subscribes_to_user_token_changes() {
    change_token(undefined)
    await renderLanding();
    expect(window.token).toBe(undefined);
    change_token(theTokenString);
    await waitUntil(() => window.token === theTokenString);
    expect(window.token).toBe(theTokenString);
}

export async function lets_user_log_out() {
    const wrapper = await renderLanding();
    await login();
    await waitUntil(() => !loginExists());
    await logout();
    await waitUntil(loginExists);
    expect(wrapper.text()).toContain("Log in");
}

export async function render_tasks_page_link_when_user_logged_in() {
    await renderLanding();
    await login();
    await waitUntil(() => !loginExists());
    expect(await navigateToTasksLinkVisible()).toBe(true);
}

export async function tasks_page_link_invisible_when_user_not_logged_in() {
    await renderLanding();
    expect(await navigateToTasksLinkVisible()).toBe(false);
}

export async function does_not_allow_navigation_to_tasks_when_logged_out() {
    const wrapper = await renderLanding();
    await navigateToTasksViaRouter();
    expect(wrapper.html()).not.toContain("I am a fake tasks page!");
}

export async function allows_navigation_to_tasks_when_logged_in() {
    const wrapper = await renderLanding();
    await login();
    await waitUntil(() => !loginExists());
    await navigateToTasks();
    await waitUntil(() => the_route() === "/tasks");
    expect(wrapper.html()).toContain("I am a fake tasks page!");
}

export async function allows_user_to_navigate_back_to_landing_page() {
    const wrapper = await renderLanding();
    await login();
    await waitUntil(() => !loginExists());
    await navigateToTasks();
    await waitUntil(() => the_route() === "/tasks");
    await navigateToLanding();
    await waitUntil(() => the_route() === "/");
    expect(wrapper.text()).toContain("A simple approach");
}

export async function renders_landing_page_by_the_default() {
    const wrapper = await renderUnknownRoute();
    expect(wrapper.text()).toContain("A simple approach");
    expect(the_route()).toBe("/");
}

export async function renders_error_boundary_for_uncaught_error() {
    const wrapper = await renders_erroring_app();
    expect(wrapper.text()).toContain("An unknown error occurred");
}
