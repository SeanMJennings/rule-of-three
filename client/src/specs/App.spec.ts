import {describe, it} from "vitest";
import {render_tasks_page, renders_landing_page} from "@/specs/App.steps";

describe("App", () => {
    it("renders landing page", renders_landing_page);
    it("renders tasks page", render_tasks_page);
});
