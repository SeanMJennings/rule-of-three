import {setupServer, SetupServerApi} from "msw/node";
import {http, HttpResponse} from "msw";
import {delay} from "@/testing/utilities";

export class MockServer {
    private server: SetupServerApi;
    public headers: Headers = new Headers();

    constructor() {
        this.server = setupServer()
    }

    public static New() {
        return new MockServer();
    }

    public start() {
        this.server.listen();
    }

    public reset() {
        this.server.resetHandlers();
        this.headers = new Headers();
    }

    public get(url: string, response: any, delayValue?: number, success = true): () => boolean {
        let called = false;
        const was_called = () => called;
        this.server.use(http.get(url, async (req) => {
            if (delayValue) await delay(delayValue)
            called = true;
            this.headers = req.request.headers
            if (!success) return HttpResponse.json(response, {status: 422})
            return HttpResponse.json(response, {status: 200})
        }));
        return was_called
    }

    public post(url: string, response?: any, success = true, delayValue?: number): () => boolean {
        let called = false;
        const was_called = () => called;
        this.server.use(http.post(url, async (req) => {
            if (delayValue) await delay(delayValue)
            called = true;
            this.headers = req.request.headers
            if (!success) return HttpResponse.json(response, {status: 422})
            if (response) return HttpResponse.json(response, {status: 201})
            return HttpResponse.json({}, {status: 204})
        }));
        return was_called
    }

    public patch(url: string, response = {}, success = true) {
        let called = false;
        const was_called = () => called;
        this.server.use(http.patch(url, (req) => {
            called = true;
            this.headers = req.request.headers
            if (!success) return HttpResponse.json(response, {status: 422})
            return HttpResponse.json({}, {status: 200})
        }));
        return was_called
    }
    
    public delete(url: string, response = {}, success = true) {
        let called = false;
        const was_called = () => called;
        this.server.use(http.delete(url, (req) => {
            called = true;
            this.headers = req.request.headers
            if (!success) return HttpResponse.json(response, {status: 422})
            return HttpResponse.json({}, {status: 200})
        }));
        return was_called
    }
}