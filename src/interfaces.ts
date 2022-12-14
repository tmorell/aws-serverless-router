import type { APIGatewayEvent, SNSEvent, SNSEventRecord } from "aws-lambda";

type ApiCallback = (req: HttpRequest, res: HttpResponse, event: APIGatewayEvent) => Promise<void>;
type EventSource = "aws:api" | "aws.events" | "aws:dynamodb" | "aws:s3" | "aws:sns";
type HttpVerb = "DELETE" | "GET" | "HEAD" | "OPTIONS" | "PATCH" | "POST" | "PUT";
type Parameter = Record<string, string | undefined> | null;
type SnsCallback<T> = (message: T, record: SNSEventRecord) => Promise<void>;

interface ApiResponse {
    body: string;
    headers: Record<string, string | number>;
    statusCode: number;
}

interface ApiRoute {
    path: string;
    verb: HttpVerb;
    callback: ApiCallback;
}

interface HttpRequest {
    body: unknown;
    params: Parameter;
    query: Parameter;
}

interface HttpResponse {
    addHeader: (name: string, value: string | number) => void;
    setBody: (value: string | unknown) => void;
    setStatusCode: (value: number) => void;
}

interface Options {
    cors?: boolean | string;
}

interface RecordEvent {
    Records: Array<{
        EventSource?: string;
        eventSource?: string;
    }>;
}
interface Response {
    api?: ApiResponse;
    events: number;
}

interface Route {
    source: EventSource;
    route: ApiRoute | SnsRoute;
}

interface Router {
    // Route
    route: (event: APIGatewayEvent | SNSEvent) => Promise<Readonly<Response>>;
    // API Gateway
    delete: (path: string, callback: ApiCallback) => void;
    get: (path: string, callback: ApiCallback) => void;
    head: (path: string, callback: ApiCallback) => void;
    options: (path: string, callback: ApiCallback) => void;
    patch: (path: string, callback: ApiCallback) => void;
    post: (path: string, callback: ApiCallback) => void;
    put: (path: string, callback: ApiCallback) => void;
    // Events
    sns: <T>(topic: string, callback: SnsCallback<T>) => void;
}

interface SnsRoute {
    topic: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: SnsCallback<any>;
}

export {
    ApiCallback,
    ApiResponse,
    ApiRoute,
    EventSource,
    HttpRequest,
    HttpResponse,
    HttpVerb,
    Options,
    Parameter,
    RecordEvent,
    Response,
    Route,
    Router,
    SnsCallback,
    SnsRoute,
};
