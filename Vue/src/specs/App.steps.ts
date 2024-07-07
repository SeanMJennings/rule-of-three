import { expect } from "vitest";
import { renderLanding, renderNotes } from "@/specs/App.page";

export async function renders_landing_page() {
  const wrapper = await renderLanding();
  expect(wrapper.text()).toContain("I am a fake landing!");
}

export async function render_notes_page() {
  const wrapper = await renderNotes();
  expect(wrapper.html()).toContain("I am a fake notes page!");
}
