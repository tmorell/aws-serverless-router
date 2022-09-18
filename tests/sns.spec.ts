import type { SNSEvent, SNSEventRecord } from "aws-lambda";

import { Pet } from "./interfaces";
import { fakeWorkload, loadEventSample } from "./util";
import { Router } from "src/index";

describe("SNS", (): void => {
    test("Topic not found", async (): Promise<void> => {
        const event = await loadEventSample<SNSEvent>("sns/sns-object.json");
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

    test("Object event", async (): Promise<void> => {
        const event = await loadEventSample<SNSEvent>("sns/sns-object.json");
        const router = Router();
        router.sns("create-pet", async (pet: Pet, record: SNSEventRecord): Promise<void> => {
            await fakeWorkload();
            expect(record.Sns.TopicArn.endsWith("create-pet")).toBeTruthy();
            expect(pet.id).toBe("4398ac6b-63b9-45a7-9c32-206fc94aa4b8");
            expect(pet.name).toBe("Max");
            expect(pet.age).toBe(12);
        });

        const r = await router.route(event);
        expect(r.events).toBe(1);
        expect.assertions(5);
    });

    test("Array event", async (): Promise<void> => {
        const event = await loadEventSample<SNSEvent>("sns/sns-array.json");
        const router = Router();
        router.sns("create-pet", async (pets: Array<Pet>, record: SNSEventRecord): Promise<void> => {
            await fakeWorkload();
            expect(record.Sns.TopicArn.endsWith("create-pet")).toBeTruthy();
            expect(pets.length).toBe(2);
            expect(pets[0].name).toBe("Max");
            expect(pets[1].name).toBe("Milo");
        });

        const r = await router.route(event);
        expect(r.events).toBe(1);
        expect.assertions(5);
    });

    test("Number event", async (): Promise<void> => {
        const event = await loadEventSample<SNSEvent>("sns/sns-number.json");
        const router = Router();
        router.sns("create-pet", async (id: number, record: SNSEventRecord): Promise<void> => {
            await fakeWorkload();
            expect(record.Sns.TopicArn.endsWith("create-pet")).toBeTruthy();
            expect(id).toBe(123);
        });

        const r = await router.route(event);
        expect(r.events).toBe(1);
        expect.assertions(3);
    });

    test("Multiple events", async (): Promise<void> => {
        const event = await loadEventSample<SNSEvent>("sns/sns-multiple.json");
        const router = Router();
        router.sns("create-pet", async (message: string | number): Promise<void> => {
            await fakeWorkload();
            expect(message).toBeTruthy();
        });

        const r = await router.route(event);
        expect(r.events).toBe(2);
        expect.assertions(3);
    });
});
