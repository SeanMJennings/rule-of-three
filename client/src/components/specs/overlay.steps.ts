import {expect} from "vitest";
import {mountOverlay} from "@/components/specs/overlay.page";

export function displays_default_error_message() {
    const wrapper = mountOverlay();
    expect(wrapper.text()).toContain("The error is unknown");
}

export function displays_error_message_for_status_code_422() {
    const wrapper = mountOverlay("wibble");
    expect(wrapper.text()).toContain("wibble");
}

export function displays_generic_error_message_for_other_status_codes() {
    const wrapper = mountOverlay("wibble", 500);
    expect(wrapper.text()).toContain("The error is unknown");
}