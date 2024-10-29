import {describe, it} from "vitest";
import {
    displays_default_error_message,
    displays_error_message_for_status_code_422, 
    displays_generic_error_message_for_other_status_codes
} from "@/components/specs/overlay.steps";

describe("Overlay", () => {
    it("displays default error message", displays_default_error_message);
    it("displays error message for status code 422", displays_error_message_for_status_code_422);
    it("displays generic error message for other status codes", displays_generic_error_message_for_other_status_codes);
});
