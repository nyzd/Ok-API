import { createClient } from "redis";

const redis = await createClient({ url: process.env.REDIS_URL }).connect();

interface Test {
    name: string;
    open_api_file_url: string;
    auth: string;
}

export async function new_test(name: string, value: Test) {
    await redis.set(name as any, JSON.stringify(value as any));
}

export async function get_test(name: string): Promise<Test> {
    return JSON.parse(await redis.get(name as any) || '{}') as Test;
}