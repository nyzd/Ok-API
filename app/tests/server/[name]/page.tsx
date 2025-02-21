import { get_test } from "@/app/lib/db";
import { test_api } from "@/app/lib/test";
import { Badge } from "@/components/ui/badge";
import { validate, } from "@apidevtools/swagger-parser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OpenAPI, OpenAPIV3 } from "openapi-types";

async function TestRouters({ paths, server_url, token }: { paths: OpenAPIV3.PathsObject, server_url: string, token: string }) {
    const result = await test_api(paths, server_url, token);
    return (
        <div className="flex flex-col gap-3">
            {result.map((v, i) => (
                <Card key={i}>
                    <CardHeader>
                        <CardTitle className="flex flex-row gap-3">
                            <Badge>
                                {v.statusCode}
                            </Badge>
                            {v.router}
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        {v.responseType === "json" ? JSON.stringify(v.response) : v.response as string}
                    </CardContent>

                </Card>
            ))
            }
        </div>
    );
}

export default async function Page({ params }: { params: Promise<{ name: string }> }) {
    const { name } = await params;

    const test = await get_test(name);
    const v = await validate(test.open_api_file_url) as OpenAPIV3.Document;

    return (
        <>
            <h1>{test.name}</h1>
            <TestRouters
                paths={v.paths as any}
                server_url={test.alternative_api_url ? test.alternative_api_url : v.servers && v.servers[0].url || ""}
                token={test.auth} />
        </>
    )
}