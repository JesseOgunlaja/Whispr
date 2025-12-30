import { Ratelimit } from "@upstash/ratelimit";
import { ParseError } from "elysia";
import { kv } from "./db/db";
import { getClientIp } from "./server-lib";

export class RatelimitError extends Error {
    constructor(public message: string) {
        super(message);
        this.name = "Ratelimit error";
    }
}

export const globalRatelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(120, "2m"),
    prefix: "global-ratelimit",
});

export const messageRatelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(10, "10s"),
    prefix: "message-ratelimit",
});

export const roomRatelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(3, "10m"),
    prefix: "room-ratelimit",
});

export async function ratelimit(
    ratelimit: Ratelimit,
    request: Request,
    key?: string
) {
    const ip = getClientIp(request);
    if (!ip) throw new ParseError(Error("Failed to get client IP"));

    const { success } = await ratelimit.limit(key ? `${ip}:${key}` : ip);
    if (!success) throw new RatelimitError("Too many requests");
}
