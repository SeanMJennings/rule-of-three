import {beforeEach, expect} from "vitest";
import {MockServer} from "@/testing/mock-server";
import {waitUntil} from "@/testing/utilities";
import {get, post, patch, del} from '@/common/http'

const mockServer = MockServer.New();
let wait_for_get: () => boolean;
let wait_for_post: () => boolean;
let wait_for_patch: () => boolean;
let wait_for_delete: () => boolean;

beforeEach(() => {
    mockServer.reset();
    wait_for_get = mockServer.get("/wibble", [])
    wait_for_post = mockServer.post("/wibble", [])
    wait_for_patch = mockServer.patch("/wibble", [])
    wait_for_delete = mockServer.delete("/wibble", [])
    mockServer.start();
    window.token = "wibble"
});

export async function make_get_request() {
    await get<any>("/wibble")
    await waitUntil(wait_for_get);
    expect(mockServer.headers.get("X-Custom-Authorization")).toContain("Bearer wibble")
}

export async function make_post_request() {
    await post("/wibble",{})
    await waitUntil(wait_for_post);
    expect(mockServer.headers.get("X-Custom-Authorization")).toContain("Bearer wibble")
}

export async function make_patch_request() {
    await patch("/wibble",{})
    await waitUntil(wait_for_patch);
    expect(mockServer.headers.get("X-Custom-Authorization")).toContain("Bearer wibble")
}

export async function make_delete_request() {
    await del("/wibble")
    await waitUntil(wait_for_delete);
    expect(mockServer.headers.get("X-Custom-Authorization")).toContain("Bearer wibble")
}