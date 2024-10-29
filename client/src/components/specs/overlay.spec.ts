import {describe, it} from "vitest";
import {displays_default_error_message} from "@/components/specs/overlay.steps";

describe("Overlay", () => {
    it("displays default error message", displays_default_error_message);
});
