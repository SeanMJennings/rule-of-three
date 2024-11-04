import type {User} from "@auth0/auth0-spa-js";
import {ref} from "vue";
import {vi} from "vitest";
vi.mock('@auth0/auth0-vue');

const a_user: User = {
    sub: "123",
}
const no_user = undefined as any as User | undefined;
const user = ref(no_user);
const isAuthenticated = ref(false);
export const mockAuth0 = {
    loginWithRedirect: () => {
        if (user.value !== undefined) {
            user.value = no_user;
            isAuthenticated.value = false;
        }
        else {
            user.value = a_user;
            isAuthenticated.value = true;
        }
    },
    logout: () => {
        user.value = no_user;
        isAuthenticated.value = false;
    },
    isAuthenticated: isAuthenticated,
    user: user
};

export const userIsAuthenticated = () => {
    return isAuthenticated.value;
}

export const resetAuth0 = () => {
    user.value = no_user;
    isAuthenticated.value = false;
}