import type { SNSEventRecord } from "aws-lambda";

import type { RecordEvent, Response, Route, SnsRoute } from "./interfaces";

export const eventRouter = async (event: RecordEvent, routes: Array<Route>): Promise<Readonly<Response>> => {
    const callbacks: Array<Promise<void>> = [];
    let count = 0;
    for (const record of event.Records) {
        // SNS
        if (record.EventSource === "aws:sns") {
            const snsRoute = routes
                .filter((value): boolean => value.source === "aws:sns")
                .map((value): SnsRoute => <SnsRoute>value.route)
                .find((value): boolean => (<SNSEventRecord>record).Sns.TopicArn.endsWith(value.topic));
            if (snsRoute) {
                const snsRecord = <SNSEventRecord>record;
                callbacks.push(snsRoute.callback(snsRecord.Sns.Message, snsRecord));
                count++;
            }
        }
    }

    if (callbacks.length === 0) {
        throw new Error("No configured route was found for this event.");
    }
    await Promise.all(callbacks);
    return Object.freeze({
        events: count,
    });
};
