import { get_test } from "@/app/lib/db";
import { OpenApi, test_api } from "@/app/lib/test";
import { Suspense } from "react";

async function TestRouters({ paths, server_url }: { paths: [string: object], server_url: string }) {
    const result = await test_api(paths, server_url);
    return (
        <>
            {result.map((v, i) => <h3 key={i}>{v.router} {v.statusCode}</h3>)}
        </>
    );
}

export default async function Page({ params }: { params: Promise<{ name: string }> }) {
    const { name } = await params;

    const test = await get_test(name);
    const resp = await fetch(test.open_api_file_url);
    const openapi: OpenApi = await resp.json();

    return (
        <>
            <TestRouters paths={openapi.paths} server_url={openapi.servers[0].url} />
        </>
    )
}