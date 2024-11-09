import {expect} from "vitest";
import {mountErrorModal} from "@/components/specs/errorModal.page";

export function displays_default_error_message() {
    const wrapper = mountErrorModal();
    expect(wrapper.text()).toContain("The error is unknown");
}

export function displays_error_message_for_status_code_422() {
    const wrapper = mountErrorModal("wibble");
    expect(wrapper.text()).toContain("wibble");
}

export function displays_generic_error_message_for_other_status_codes() {
    const wrapper = mountErrorModal("wibble", 500);
    expect(wrapper.text()).toContain("The error is unknown");
}