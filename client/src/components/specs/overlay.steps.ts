import {expect} from "vitest";
import {mountOverlay} from "@/components/specs/overlay.page";

export function displays_default_error_message() {
    const wrapper = mountOverlay();
    expect(wrapper.text()).toContain("The error is unknown");
}