import type {User} from "@auth0/auth0-spa-js";
import {type Ref, ref} from "vue";
import {vi} from "vitest";
import {owner_email} from "@/state-machines/specs/tasks.api-mocks";
vi.mock('@auth0/auth0-vue');

const a_user: User = {
    sub: "123",
    name: "Mr wibble",
    email: owner_email
}
const no_user = undefined as any as User | undefined;
const user = ref(no_user);
const isAuthenticated = ref(false);
export const theTokenString = "a token";
const token: Ref<{__raw: string | undefined}>  = ref({__raw: theTokenString});
export const mockAuth0 = {
    loginWithPopup: () => {
        if (user.value !== undefined) {
            user.value = no_user;
            isAuthenticated.value = false;
        }
        else {
            user.value = a_user;
            isAuthenticated.value = true;
        }
        return Promise.resolve();
    },
    idTokenClaims: token,
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

export const change_token = (new_token: string | undefined) => {
    token.value = {__raw: new_token};
}

export const login = async () => {
    await mockAuth0.loginWithPopup();
}