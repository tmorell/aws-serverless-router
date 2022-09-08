export class ApiGatewayError extends Error {
    readonly name = "ApiError.name";
    constructor(readonly statusCode: number, readonly message: string, readonly cause?: Error) {
        super(message);
    }
}
