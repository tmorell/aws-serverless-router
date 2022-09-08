export class EventError extends Error {
    readonly name = "EventError";
    constructor(readonly message: string, readonly cause?: Error) {
        super(message);
    }
}
