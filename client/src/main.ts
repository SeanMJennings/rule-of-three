import "./assets/main.css";

import {createApp} from "vue";
import {createPinia} from "pinia";

import App from "./App.vue";
import router from "./router";
import {createAuth0} from "@auth0/auth0-vue";

const auth0_domain = import.meta.env.VITE_AUTH_0_DOMAIN;
const auth0_client_id = import.meta.env.VITE_AUTH_0_CLIENT_ID
const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(
    createAuth0({
        domain: auth0_domain,
        clientId: auth0_client_id,
        authorizationParams: {
            redirect_uri: window.location.origin
        }
    })
);

app.mount("#app");