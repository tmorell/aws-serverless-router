import { promises } from "fs";
import { join } from "path";

export const loadEventSample = async <T>(fileName: string): Promise<T> => {
    return JSON.parse(await promises.readFile(join("./tests", "event-samples", fileName), { encoding: "utf-8" }));
};

export interface Pet {
    name: string;
    dob: string;
    colors: Array<string>;
    achievements: {
        miss: number;
        hits: number;
    };
}

export const fakeWorkload = (): Promise<void> => {
    return new Promise((resolve): void => {
        setTimeout((): void => {
            resolve();
        }, 0);
    });
};

export class CustomError extends Error {
    constructor(message: string, readonly severity: number) {
        super(message);
    }
}