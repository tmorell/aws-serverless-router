import type { APIGatewayEvent, SNSEvent, SNSEventRecord } from "aws-lambda";

type EventSource = "aws:api" | "aws.events" | "aws:dynamodb" | "aws:s3" | "aws:sns";
type HttpVerb = "DELETE" | "GET" | "HEAD" | "OPTIONS" | "PATCH" | "POST" | "PUT";
type Parameter = Record<string, string | undefined> | null;

interface ApiResponse {
    body: string;
    headers: Record<string, string | number>;
    statusCode: number;
}

interface ApiRoute {
    path: string;
    verb: HttpVerb;
    callback: (req: HttpRequest, res: HttpResponse) => Promise<void>;
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
    delete: (path: string, callback: (req: HttpRequest, res: HttpResponse) => Promise<void>) => void;
    get: (path: string, callback: (req: HttpRequest, res: HttpResponse) => Promise<void>) => void;
    head: (path: string, callback: (req: HttpRequest, res: HttpResponse) => Promise<void>) => void;
    options: (path: string, callback: (req: HttpRequest, res: HttpResponse) => Promise<void>) => void;
    patch: (path: string, callback: (req: HttpRequest, res: HttpResponse) => Promise<void>) => void;
    post: (path: string, callback: (req: HttpRequest, res: HttpResponse) => Promise<void>) => void;
    put: (path: string, callback: (req: HttpRequest, res: HttpResponse) => Promise<void>) => void;
    // Events
    sns: (topic: string, callback: (record: SNSEventRecord) => Promise<void>) => void;
}

interface SnsRoute {
    topic: string;
    callback: (record: SNSEventRecord) => Promise<void>;
}

export {
    ApiResponse,
    EventSource,
    HttpRequest,
    HttpResponse,
    HttpVerb,
    Options,
    Parameter,
    RecordEvent,
    Response,
    ApiRoute,
    Route,
    Router,
    SnsRoute,
};
