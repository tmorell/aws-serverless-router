import type { APIGatewayEvent } from "aws-lambda";

import { apiGateway } from "./api-gateway";
import { ApiGatewayError } from "./api-gateway-error";
import { EventError } from "./event-error";
import { eventRouter } from "./event-router";
import type { ApiCallback, EventSource, HttpRequest, HttpResponse, HttpVerb, RecordEvent, Options, Response, Route, Router, SnsCallback } from "./interfaces";

const router = (options: Options = {}): Readonly<Router> => {
    const routes: Array<Route> = [];
    const addApiRoute = (source: EventSource, verb: HttpVerb): (path: string, callback: ApiCallback) => void =>
        (path: string, callback: ApiCallback): void => {
            routes.push({ source, route: { path, verb, callback } });
        };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const addSnsRoute = (source: EventSource): (topic: string, callback: SnsCallback<any>) => void =>
        <T>(topic: string, callback: SnsCallback<T>): void => {
            routes.push({ source, route: { topic, callback } });
        };
    const route = (event: APIGatewayEvent | RecordEvent): Promise<Readonly<Response>> => {
        if ((<APIGatewayEvent>event).httpMethod) {
            return apiGateway(<APIGatewayEvent>event, routes.filter((value): boolean => value.source === "aws:api"), options);
        }
        if ((<RecordEvent>event).Records) {
            return eventRouter(<RecordEvent>event, routes.filter((value): boolean => value.source !== "aws:api"));
        }
        throw new EventError("Unknown event type.");
    };

    return Object.freeze({
        // Route
        route,
        // API Gateway
        delete: addApiRoute("aws:api", "DELETE"),
        get: addApiRoute("aws:api", "GET"),
        head: addApiRoute("aws:api", "HEAD"),
        options: addApiRoute("aws:api", "OPTIONS"),
        patch: addApiRoute("aws:api", "PATCH"),
        post: addApiRoute("aws:api", "POST"),
        put: addApiRoute("aws:api", "PUT"),
        // Events
        sns: addSnsRoute("aws:sns"),
    });
};

export {
    ApiGatewayError,
    EventError,
    HttpRequest,
    HttpResponse,
    router as Router,
};
