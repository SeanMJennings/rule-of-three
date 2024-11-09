import {mount, VueWrapper} from '@vue/test-utils'
import {afterEach} from 'vitest'
import ErrorModal from "@/components/ErrorModal.vue";

// @ts-ignore
HTMLCanvasElement.prototype.getContext = () => {};

let app: VueWrapper;

afterEach(() => {
    app.unmount();
});

export function mountErrorModal(message: string = "", code: number = 422, ) {
    app = mount(ErrorModal,{
        props: {
            theError: message,
            code: code,
            onClose: () => {}
        }
    });
    return app
}