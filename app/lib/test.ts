import { OpenAPIV3 } from "openapi-types";

export interface OpenApi {
    servers: { url: string }[];
    info: {
        title: string;
        version: string;
    };
    paths: [string: object]
}

export interface LocalTestInfo {
    method: RequestMethod;
    url: string;
    title: string;
    description: string;
}

export interface ResponseError {
    status: number;
    message: string;
}

type ResponseBodyType = "json" | "text";
export type RequestMethod = "get" | "post" | "put" | "delete";

interface TestResult {
    router: string;
    method: RequestMethod;
    statusCode: number;
    responseType: ResponseBodyType;
    response: object | string;
    isOk: boolean;
}

function getSchema(obj: OpenAPIV3.OperationObject): OpenAPIV3.SchemaObject {
    const requestBody =
        (obj.requestBody as OpenAPIV3.RequestBodyObject | undefined);

    return requestBody?.content['application/json']?.schema as OpenAPIV3.SchemaObject;
}

function generateRandomString(len: number): string {
    let randomName = "";
    for (let i = 0; i <= len; i++) {
        randomName +=
            String.fromCharCode(Math.floor(Math.random() * (122 - 97) + 97));
    }

    return randomName
}

function generateRandomNumber(len: number): number {
    let randomInt = "";
    for (let i = 0; i <= len; i++) {
        randomInt +=
            String.fromCharCode(Math.floor(Math.random() * (57 - 49) + 49));
    }

    return parseInt(randomInt);
}

function generateRandomExample(
    type: OpenAPIV3.NonArraySchemaObjectType,
    format?: string,
    min?: number
): string | number | boolean | object {
    switch (type) {
        case "string":
            if (format && format === "email") {
                return `${generateRandomString(4)}@gmail.com`;
            }
            return generateRandomString(5);
        case "boolean":
            return true
        case "integer":
            if (min) {
                return generateRandomNumber(min);
            }
            return 1
        case "number":
            if (min) {
                return generateRandomNumber(min);
            }
            return 1
        case "object":
            return {}

        default:
            return 0
    }
}

function buildRequestBody(schema: OpenAPIV3.SchemaObject): object {
    const obj = {};
    if (schema?.type && schema.type === "object") {
        for (const [name, inner] of Object.entries(schema.properties || {})) {
            const i = inner as OpenAPIV3.SchemaObject;
            Object.assign(obj, {
                [name]: (i).example
                    || generateRandomExample((i.type || "string") as OpenAPIV3.NonArraySchemaObjectType, i.format)
            })
        }
    }

    return obj;
}

async function test_router(
    info: { url: string, router: string, method: RequestMethod, token: string },
    detail: OpenAPIV3.OperationObject
): Promise<TestResult> {
    const schema = getSchema(detail);

    const requestBody = buildRequestBody(schema);
    console.log(requestBody)

    const headers: HeadersInit = {};

    if (info.token) {
        headers["Authorization"] = info.token;
    }

    if (info.method === "post") {
        // TODO: not always content type is json
        headers["Content-type"] = "application/json";
    }

    const resp = await fetch(info.url + info.router, {
        method: info.method,
        headers: headers,
        body: requestBody && info.method === "post" ? JSON.stringify(requestBody) : undefined,
    });

    const responseContentType = resp.headers.get("Content-type");

    console.log(responseContentType)

    let respBody;
    let respBodyType: ResponseBodyType = "text";

    if (responseContentType === "application/json") {
        respBody = await resp.json();
        respBodyType = "json";
    } else if (responseContentType === "text/plain; charset=utf-8") {
        respBody = await resp.text();
        respBodyType = "text";
    }

    return {
        responseType: respBodyType,
        router: info.router,
        isOk: resp.status === 200,
        method: info.method,
        response: respBody,
        statusCode: resp.status
    }
}

export async function test_api(paths: OpenAPIV3.PathsObject, server_url: string, token: string): Promise<TestResult[]> {
    const result: TestResult[] = [];

    for (const [route, methods] of Object.entries(paths)) {
        for (const [method, detail] of Object.entries(methods || {})) {
            result.push(await test_router(
                { url: server_url, method: method as RequestMethod, router: route, token: token }
                , detail as OpenAPIV3.OperationObject)
            )
        }
    }

    return result;
}