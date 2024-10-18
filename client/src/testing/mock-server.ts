import {setupServer, SetupServerApi} from "msw/node";
import {http, HttpResponse} from "msw";

export class MockServer {
    private server: SetupServerApi;

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
    }

    public get(url: string, response: any) {
        let called = false;
        const was_called = () => called;
        this.server.use(http.get(url, () => {
            called = true;
            return HttpResponse.json(response, {status: 200})
        }));
        return was_called
    }

    public post(url: string, response?: any): () => boolean {
        let called = false;
        const was_called = () => called;
        this.server.use(http.post(url, () => {
            called = true;
            if (response) {
                return HttpResponse.json(response, {status: 201})
            }
            return HttpResponse.json({}, {status: 204})
        }));
        return was_called
    }

    public patch(url: string) {
        let called = false;
        const was_called = () => called;
        this.server.use(http.patch(url, () => {
            called = true;
            return HttpResponse.json({}, {status: 204})
        }));
        return was_called
    }
}