import type { APIGatewayEvent } from "aws-lambda";

import { fakeWorkload, loadEventSample } from "./util";
import { EventError, Router } from "src/index";

describe("Events", (): void => {
    test("Not found", async (): Promise<void> => {
        const event = await loadEventSample<APIGatewayEvent>("unknown/unknown.json");
        const router = Router();
        router.post("/pets", async (): Promise<void> => {
            await fakeWorkload();
        });

        try {
            await router.route(event);
        } catch (error: unknown) {
            const err = <Error>error;
            expect(err instanceof EventError).toBeTruthy();
            expect(err.message).toBe("Unknown event type.");
        }
    });
});
