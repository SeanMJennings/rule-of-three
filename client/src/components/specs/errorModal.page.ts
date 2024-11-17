import {mount, VueWrapper} from '@vue/test-utils'
import {afterEach} from 'vitest'
import ErrorModal from "@/components/ErrorModal.vue";
import TestBed from "@/components/specs/TestBed.vue";

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

export function mountTestBed() {
    app = mount(TestBed, {attachTo: document.body});
    return app;
}

export function modalExists() {
    return elements.modal.exists();
}

export function pressEscape() {
    return elements.modal.trigger("keydown.Escape");
}

const elements = {
    get modal() {
        return app.find("#overlay");
    }
}