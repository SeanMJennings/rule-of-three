import {mount, VueWrapper} from '@vue/test-utils'
import {afterEach} from 'vitest'
import Overlay from "@/components/Overlay.vue";

let app: VueWrapper;

afterEach(() => {
    app.unmount();
});

export function mountOverlay(message: string = "", code: number = 422, ) {
    app = mount(Overlay,{
        props: {
            theError: message,
            code: code,
            onClose: () => {}
        }
    });
    return app
}