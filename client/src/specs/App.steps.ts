import {expect} from "vitest";
import {renderLanding, renders_erroring_app, renderTasks, renderUnknownRoute, the_route} from "@/specs/App.page";

export async function renders_landing_page() {
    const wrapper = await renderLanding();
    expect(wrapper.text()).toContain("I am a fake landing!");
}

export async function render_tasks_page() {
    const wrapper = await renderTasks();
    expect(wrapper.html()).toContain("I am a fake tasks page!");
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
