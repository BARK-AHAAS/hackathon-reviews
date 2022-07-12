import { createClient } from "@commercetools/sdk-client";
import { createHttpMiddleware } from "@commercetools/sdk-middleware-http";
import { createRequestBuilder } from "@commercetools/api-request-builder";

const client = createClient({
  middlewares: [
    createHttpMiddleware({ host: process.env.NEXT_PUBLIC_CTP_API_URL }),
  ],
});

// https://commercetools.github.io/nodejs/sdk/api/apiRequestBuilder.html
const requestBuilder = createRequestBuilder({
  projectKey: process.env.NEXT_PUBLIC_CTP_PROJECT_KEY,
});

const headers = {
  Authorization: `Bearer ${process.env.NEXT_PUBLIC_CT_ACCESS_TOKEN}`,
};

export { client, requestBuilder, headers };
