import {mount, VueWrapper} from '@vue/test-utils'
import {afterEach} from 'vitest'
import Overlay from "@/components/Overlay.vue";

let app: VueWrapper;

afterEach(() => {
    app.unmount();
});

export function mountOverlay() {
    app = mount(Overlay,{
        props: {
            theError: "",
            onClose: () => {}
        }
    });
    return app
}