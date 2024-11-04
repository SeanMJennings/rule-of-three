import {describe, it} from "vitest";
import {make_delete_request, make_get_request, make_patch_request, make_post_request} from "@/common/specs/http.steps";

describe("HTTP", () => {
    it("should make a GET request", make_get_request);
    it("should make a POST request", make_post_request);
    it("should make a PATCH request", make_patch_request);
    it("should make a DELETE request", make_delete_request);
})