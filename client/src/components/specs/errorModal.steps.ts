﻿import {expect} from "vitest";
import {mountErrorModal} from "@/components/specs/errorModal.page";

export function displays_default_error_message() {
    const wrapper = mountErrorModal();
    expect(wrapper.text()).toContain("The error is unknown");
}

export function displays_error_message_for_non_server_error_codes() {
    const wrapper = mountErrorModal("wibble", 404);
    expect(wrapper.text()).toContain("wibble");
}

export function displays_generic_error_message_for_server_error_codes() {
    const wrapper = mountErrorModal("wibble", 500);
    expect(wrapper.text()).toContain("The error is unknown");
}