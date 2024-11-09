import {describe, it} from "vitest";
import {
    displays_default_error_message,
    displays_error_message_for_non_server_error_codes, 
    displays_generic_error_message_for_server_error_codes
} from "@/components/specs/errorModal.steps";

describe("Error Modal", () => {
    it("displays default error message", displays_default_error_message);
    it("displays error message for non server error codes", displays_error_message_for_non_server_error_codes);
    it("displays generic error message for server error codes", displays_generic_error_message_for_server_error_codes);
});
