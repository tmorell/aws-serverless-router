import type { APIGatewayEvent } from "aws-lambda";

import { CustomError, fakeWorkload, loadEventSample, Pet } from "./util";
import { ApiGatewayError, HttpRequest, HttpResponse, Router } from "src/index";

describe("API", (): void => {
    describe("Exceptions", (): void => {
        test("Unhandled standard exception", async (): Promise<void> => {
            const event = await loadEventSample<APIGatewayEvent>("api/get-pets.json");
            const router = Router();
            router.get("/pets", async (): Promise<void> => {
                await fakeWorkload();
                throw new Error("Something bad just happened.");
            });

            try {
                await router.route(event);
            } catch (error: unknown) {
                const err = <ApiGatewayError>error;
                expect(err instanceof ApiGatewayError).toBeTruthy();
                expect(err.statusCode).toBe(500);
                expect(err.message).toBe("Something bad just happened.");
            }
        });

        test("Unhandled custom exception", async (): Promise<void> => {
            const event = await loadEventSample<APIGatewayEvent>("api/get-pets.json");
            const router = Router();
            router.get("/pets", async (): Promise<void> => {
                await fakeWorkload();
                throw new CustomError("Something bad just happened.", 10);
            });

            try {
                await router.route(event);
            } catch (error: unknown) {
                const err = <ApiGatewayError>error;
                expect(err instanceof ApiGatewayError).toBeTruthy();
                expect(err.statusCode).toBe(500);
                expect(err.message).toBe("Something bad just happened.");
                expect(err.cause instanceof CustomError).toBeTruthy();
                expect((<CustomError><unknown>err.cause).severity).toBe(10);
            }
        });

        test("Verb not found", async (): Promise<void> => {
            const event = await loadEventSample<APIGatewayEvent>("api/get-pets.json");
            const router = Router();
            router.post("/pets", async (): Promise<void> => {
                await fakeWorkload();
            });

            try {
                await router.route(event);
            } catch (error: unknown) {
                const err = <ApiGatewayError>error;
                expect(err instanceof ApiGatewayError).toBeTruthy();
                expect(err.statusCode).toBe(500);
                expect(err.message).toBe("No configured route was found for 'GET: /pets'.");
            }
        });

        test("Path not found", async (): Promise<void> => {
            const event = await loadEventSample<APIGatewayEvent>("api/get-pets.json");
            const router = Router();
            router.get("/pets-no", async (): Promise<void> => {
                await fakeWorkload();
            });

            try {
                await router.route(event);
            } catch (error: unknown) {
                const err = <ApiGatewayError>error;
                expect(err instanceof ApiGatewayError).toBeTruthy();
                expect(err.statusCode).toBe(500);
                expect(err.message).toBe("No configured route was found for 'GET: /pets'.");
            }
        });
    });

    describe("Request", (): void => {
        test("Empty", async (): Promise<void> => {
            const event = await loadEventSample<APIGatewayEvent>("api/get-pets.json");
            const router = Router();
            router.get("/pets", async (req: HttpRequest, _res: HttpResponse, srcEvent: APIGatewayEvent): Promise<void> => {
                await fakeWorkload();
                expect(req.params).toBeNull();
                expect(req.query).toBeNull();
                expect(req.body).toBeNull();
                expect(srcEvent.path).toBe("/pets/");
            });

            await router.route(event);
            expect.assertions(4);
        });

        test("Parameters provided", async (): Promise<void> => {
            const event = await loadEventSample<APIGatewayEvent>("api/get-pets-id-vaccines-id.json");
            const router = Router();
            router.get("/pets/{id}/vaccines/{vaccine-id}", async (req: HttpRequest): Promise<void> => {
                await fakeWorkload();
                expect(req.params?.id).toBe("123");
                expect(req.params?.["vaccine-id"]).toBe("789");
                expect(req.query?.low).toBe("1");
                expect(req.query?.high).toBe("2");
            });

            await router.route(event);
            expect.assertions(4);
        });

        test("Body content", async (): Promise<void> => {
            const event = await loadEventSample<APIGatewayEvent>("api/post-pets.json");
            const router = Router();
            router.post("/pets", async (req: HttpRequest): Promise<void> => {
                await fakeWorkload();
                const pet = <Pet>req.body;
                expect(pet.name).toBe("Chucky");
                expect(pet.colors.length).toBe(2);
                expect(pet.achievements.miss).toBe(0);
                expect(pet.achievements.hits).toBe(79);
            });

            await router.route(event);
            expect.assertions(4);
        });
    });

    describe("Response", (): void => {
        test("Default body, headers, and status code", async (): Promise<void> => {
            const event = await loadEventSample<APIGatewayEvent>("api/get-pets.json");
            const router = Router();
            router.get("/pets", async (): Promise<void> => {
                await fakeWorkload();
            });

            const r = (await router.route(event)).api;
            expect(r?.body).toBe("");
            expect(Object.keys(r?.headers || {}).length).toBe(1);
            expect(r?.headers["Content-Type"]).toBe("application/json");
            expect(r?.statusCode).toBe(200);
        });

        test("Custom body, headers, and status code", async (): Promise<void> => {
            const event = await loadEventSample<APIGatewayEvent>("api/get-pets.json");
            const router = Router();
            router.get("/pets", async (_req: HttpRequest, res: HttpResponse): Promise<void> => {
                await fakeWorkload();
                res.addHeader("Content-Type", "text/html");
                res.addHeader("X-Trace-Id", "qud725");
                res.setBody("<h1>Hi</h1>");
                res.setStatusCode(201);
            });

            const r = (await router.route(event)).api;
            expect(r?.body).toBe("<h1>Hi</h1>");
            expect(Object.keys(r?.headers || {}).length).toBe(2);
            expect(r?.headers["Content-Type"]).toBe("text/html");
            expect(r?.headers["X-Trace-Id"]).toBe("qud725");
            expect(r?.statusCode).toBe(201);
        });

        test("Body string", async (): Promise<void> => {
            const event = await loadEventSample<APIGatewayEvent>("api/get-pets.json");
            const router = Router();
            router.get("/pets", async (_req: HttpRequest, res: HttpResponse): Promise<void> => {
                await fakeWorkload();
                res.setBody("Hello pet");
            });

            const r = (await router.route(event)).api;
            expect(r?.body).toBe("Hello pet");
        });

        test("Body number", async (): Promise<void> => {
            const event = await loadEventSample<APIGatewayEvent>("api/get-pets.json");
            const router = Router();
            router.get("/pets", async (_req: HttpRequest, res: HttpResponse): Promise<void> => {
                await fakeWorkload();
                res.setBody(123);
            });

            const r = (await router.route(event)).api;
            expect(r?.body).toBe(123);
        });

        test("Body Json", async (): Promise<void> => {
            const event = await loadEventSample<APIGatewayEvent>("api/get-pets.json");
            const router = Router();
            router.get("/pets", async (_req: HttpRequest, res: HttpResponse): Promise<void> => {
                await fakeWorkload();
                res.setBody({ id: 123, name: "Chucky" });
            });

            const r = (await router.route(event)).api;
            expect(r?.body).toBe("{\"id\":123,\"name\":\"Chucky\"}");
        });
    });

    describe("Options", (): void => {
        test("Default", async (): Promise<void> => {
            const event = await loadEventSample<APIGatewayEvent>("api/get-pets.json");
            const router = Router();
            router.get("/pets", async (): Promise<void> => {
                await fakeWorkload();
            });

            const r = (await router.route(event)).api;
            expect(Object.keys(r?.headers || {}).length).toBe(1);
        });

        test("Options: cors = true", async (): Promise<void> => {
            const event = await loadEventSample<APIGatewayEvent>("api/get-pets.json");
            const router = Router({
                cors: true,
            });
            router.get("/pets", async (): Promise<void> => {
                await fakeWorkload();
            });

            const r = (await router.route(event)).api;
            expect(Object.keys(r?.headers || {}).length).toBe(2);
            expect(r?.headers["Access-Control-Allow-Origin"]).toBe("*");
        });

        test("Options: cors = string", async (): Promise<void> => {
            const event = await loadEventSample<APIGatewayEvent>("api/get-pets.json");
            const router = Router({
                cors: "https://acme.com",
            });
            router.get("/pets", async (): Promise<void> => {
                await fakeWorkload();
            });

            const r = (await router.route(event)).api;
            expect(Object.keys(r?.headers || {}).length).toBe(2);
            expect(r?.headers["Access-Control-Allow-Origin"]).toBe("https://acme.com");
        });
    });
});
