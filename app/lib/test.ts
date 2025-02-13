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

export type RequestMethod = "get" | "post" | "put" | "delete";

interface TestResult {
    router: string;
    method: RequestMethod;
    statusCode: number;
    response: object | string;
    isOk: boolean;
}

async function test_router(
    info: { url: string, router: string, method: RequestMethod },
    detail: object
): Promise<TestResult> {
    console.log(detail)
    const resp = await fetch(info.url + info.router, {
        method: info.method,
    });
    const resp_body = resp.status === 200 ? await resp.json() : await resp.text();

    console.log(resp.status)

    return {
        router: info.router,
        isOk: resp.status === 200,
        method: info.method,
        response: resp_body,
        statusCode: resp.status
    }
}

export async function test_api(paths: [string: object], server_url: string): Promise<TestResult[]> {
    const result: TestResult[] = [];

    for (const [route, methods] of Object.entries(paths)) {
        for (const [method, detail] of Object.entries(methods)) {
            result.push(await test_router({ url: server_url, method: method as RequestMethod, router: route }, detail))
        }
    }

    console.log(result)

    return result;
}