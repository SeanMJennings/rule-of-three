import {describe, it} from "vitest";
import {defines_each_state_as_loading_or_not} from "@/state-machines/specs/tasks.steps";

describe("Tasks", () => {
    it("defines each state as loading or not", defines_each_state_as_loading_or_not);
})