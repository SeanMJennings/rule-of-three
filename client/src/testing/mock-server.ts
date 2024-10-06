import {setupServer, SetupServerApi} from "msw/node";
import {http, HttpResponse} from "msw";

class MockServer {
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
    
    public stop() {
        this.server.close();
    }
    
    public reset() {
        this.server.resetHandlers();
    }
    
    public useGet(url: string, response: any) {
        this.server.use(http.get(url, async ({}) => {
            return HttpResponse.json(response, { status: 200 })
        }));
    }
    
    public usePost(url: string, response?: any) {
        this.server.use(http.post(url, async ({}) => {
            if (response) {
                return HttpResponse.json(response, { status: 201 })
            }
            return HttpResponse.json({}, { status: 204 })
        }));
    }
    
    public usePatch(url: string) {
        this.server.use(http.patch(url, async ({}) => {
            return HttpResponse.json({}, { status: 204 })
        }));
    }

    public useDelete(url: string) {
        this.server.use(http.delete(url, async ({}) => {
            return HttpResponse.json({}, { status: 204 })
        }));
    }
}