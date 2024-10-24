import {describe, it} from "vitest";
import {render_tasks_page, renders_landing_page, renders_landing_page_by_the_default} from "@/specs/App.steps";

describe("App", () => {
    it("renders landing page", renders_landing_page);
    it("renders tasks page", render_tasks_page);
    it("renders landing page by default", renders_landing_page_by_the_default);
});
