import type { APIGatewayEvent } from "aws-lambda";

import { ApiGatewayError } from "./api-gateway-error";
import type { ApiResponse, ApiRoute, Options, Response, Route, HttpResponse } from "./interfaces";

interface GetResponse extends HttpResponse {
    getResponse: (options: Options) => Readonly<ApiResponse>;
}

const response = (): Readonly<HttpResponse> => {
    let body: string | unknown;
    const headers: Record<string, string | number> = {};
    let statusCode = 200;
    return Object.freeze({
        addHeader: (name: string, value: string | number): void => {
            headers[name] = value;
        },
        getResponse(options: Options): Readonly<ApiResponse> {
            if (Object.keys(headers).length === 0) {
                headers["Content-Type"] = "application/json";
            }
            if (options.cors) {
                headers["Access-Control-Allow-Origin"] = typeof options.cors === "boolean" ? "*" : options.cors;
            }
            return Object.freeze({
                body: Object.prototype.toString.call(body) === "[object Object]" ? JSON.stringify(body) : <string>body || "",
                headers: headers,
                statusCode: statusCode,
            });
        },
        setBody: (value: string | unknown): void => {
            body = value;
        },
        setStatusCode: (value: number): void => {
            statusCode = value;
        },
    });
};

export const apiGateway = async (event: APIGatewayEvent, routes: Array<Route>, options: Options): Promise<Readonly<Response>> => {
    const route = routes
        .map((value): ApiRoute => <ApiRoute>value.route)
        .find((value): boolean => value.verb === event.httpMethod && value.path === event.resource);
    if (!route) {
        throw new ApiGatewayError(500, `No configured route was found for '${event.httpMethod}: ${event.resource}'.`);
    }

    try {
        const res = response();
        await route.callback(Object.freeze({
            body: event.body ? JSON.parse(event.body) : null,
            params: event.pathParameters,
            query: event.queryStringParameters,
        }), res, event);
        return Object.freeze({
            api: (<GetResponse>res).getResponse(options),
            events: 1,
        });
    } catch (error: unknown) {
        throw new ApiGatewayError(500, (<Error>error).message, <Error>error);
    }
};
