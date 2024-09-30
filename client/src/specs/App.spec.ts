import { describe, it } from "vitest";
import { renders_landing_page, render_tasks_page } from "@/specs/App.steps";

describe("App", () => {
  it("renders landing page", renders_landing_page);
  it("renders tasks page", render_tasks_page);
});
