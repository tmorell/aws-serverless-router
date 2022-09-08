import type { SNSEvent, SNSEventRecord } from "aws-lambda";

import { fakeWorkload, loadEventSample } from "./util";
import { Router } from "src/index";

describe("SNS", (): void => {
    test("Topic not found", async (): Promise<void> => {
        const event = await loadEventSample<SNSEvent>("sns/sns-single.json");
        const router = Router();
        router.sns("none-existing-topic", async (): Promise<void> => {
            await fakeWorkload();
        });

        try {
            await router.route(event);
        } catch (error: unknown) {
            const err = <Error>error;
            expect(err.message).toBe("No configured route was found for this event.");
        }
    });

    test("Single event", async (): Promise<void> => {
        const event = await loadEventSample<SNSEvent>("sns/sns-single.json");
        const router = Router();
        router.sns("create-pet", async (record: SNSEventRecord): Promise<void> => {
            await fakeWorkload();
            expect(record.Sns.TopicArn.endsWith("create-pet")).toBeTruthy();
            expect(record.Sns.Message).toBe("Some message");
        });

        const r = await router.route(event);
        expect(r.events).toBe(1);
        expect.assertions(3);
    });

    test("Multiple events", async (): Promise<void> => {
        const event = await loadEventSample<SNSEvent>("sns/sns-multiple.json");
        const router = Router();
        router.sns("create-pet", async (record: SNSEventRecord): Promise<void> => {
            await fakeWorkload();
            expect(record.Sns.TopicArn.endsWith("create-pet")).toBeTruthy();
        });

        const r = await router.route(event);
        expect(r.events).toBe(2);
        expect.assertions(3);
    });
});
