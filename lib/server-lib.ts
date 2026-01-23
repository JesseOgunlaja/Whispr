import { headers } from "next/headers";
import React from "react";
import { createServerStream } from "streamthing";
import { env } from "./env";

export async function createWebsocketStream() {
    return await createServerStream({
        id: env.NEXT_PUBLIC_STREAMTHING_SERVER_ID,
        region: env.NEXT_PUBLIC_STREAMTHING_SERVER_REGION,
        password: env.STREAMTHING_SERVER_PASSWORD,
    });
}

export function getClientIp(request: Request) {
    const { headers } = request;

    const cloudflareIp = headers.get("cf-connecting-ip");
    if (cloudflareIp) return cloudflareIp;

    const xff = headers.get("x-forwarded-for");
    if (xff) return xff.split(",")[0].trim();

    const realIp = headers.get("x-real-ip");
    if (realIp) return realIp;

    if (request.url.includes("localhost:3000")) return "127.0.0.1";
}

export async function runInBackground(fn: () => Promise<void>) {
    void fn();
}

export const getUserIdHeader = React.cache(async () => {
    const userId = (await headers()).get("x-user-id");
    if (!userId) throw new Error("No user id found");

    return userId;
});
