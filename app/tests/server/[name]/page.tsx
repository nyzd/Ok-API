import { get_test } from "@/app/lib/db";
import { OpenApi, test_api } from "@/app/lib/test";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Josefin_Sans } from "next/font/google";

async function TestRouters({ paths, server_url }: { paths: [string: object], server_url: string }) {
    const result = await test_api(paths, server_url);
    return (
        <div className="flex flex-col gap-3">
            {result.map((v, i) => (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex flex-row gap-3">
                            <Badge>
                                {v.statusCode}
                            </Badge>
                            {v.router}
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        {v.response.toString()}
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
    const resp = await fetch(test.open_api_file_url);
    const openapi: OpenApi = await resp.json();

    return (
        <>
            <h1>{test.name}</h1>
            <TestRouters paths={openapi.paths} server_url={openapi.servers[0].url} />
        </>
    )
}