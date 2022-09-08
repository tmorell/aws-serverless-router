# AWS Serverless Router
`AWS Serverless Router` is a general purpose routing library supporting `API Gateway` and `SNS`.

# WIP
This is an initial draft, work in progress, and it should not be used in production. Specification and interfaces will change.

Features to be supported:
* S3, SQS and DynamoDB support.
* Etag for API Gateway.
* Error handling.

# Usage Example

```javascript
import type { SNSEventRecord } from "aws-lambda";
import { ApiGatewayError, HttpRequest, HttpResponse, Router } from "aws-serverless-router";
import { getPets, getPet, updateOwnerEmail } from "src/pets";

exports.handler = async (event) => {
    const router = Router({
        cors: "https://pets.io",
    });
    router.get("/pets", async (req: HttpRequest, res: HttpResponse) => {
        res.setBody(await getPets());
    });
    router.get("/pets/{id}", async (req: HttpRequest, res: HttpResponse) => {
        const pet = await getPet(req.params?.id);
        if (!pet) {
            res.setStatusCode(404);
            return;
        }
        res.setBody(pet);
    });
    router.sns("owner-notified", async (record: SNSEventRecord): Promise<void> => {
        await updateOwnerEmail(record.Sns.Message);
    });

    try {
        return await router.route(event);
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({message: "Unhandled exception."}),
        };
    }
};
```
