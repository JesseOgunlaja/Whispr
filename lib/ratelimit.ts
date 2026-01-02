import { ParseError } from "elysia";
import { redis } from "./db/db";
import { getClientIp } from "./server-lib";

export class RatelimitError extends Error {
    constructor(public message: string) {
        super(message);
        this.name = "Ratelimit error";
    }
}

class Ratelimit {
    constructor(
        public config: {
            time: number;
            maxRequests: number;
            prefix: string;
        }
    ) {}

    async limit(key: string) {
        const { time, maxRequests, prefix } = this.config;
        const fullKey = `${prefix}:${key}`;

        const count = await redis.incr(fullKey);

        if (count === 1) {
            await redis.expire(fullKey, time);
        }

        if (count > maxRequests) {
            throw new RatelimitError("Too many requests");
        }
    }
}

export const globalRatelimit = new Ratelimit({
    time: 120,
    maxRequests: 120,
    prefix: "global-ratelimit",
});

export const messageRatelimit = new Ratelimit({
    time: 10,
    maxRequests: 10,
    prefix: "message-ratelimit",
});

export const roomRatelimit = new Ratelimit({
    time: 600,
    maxRequests: 3,
    prefix: "room-ratelimit",
});

export async function ratelimit(
    ratelimit: Ratelimit,
    request: Request,
    key?: string
) {
    const ip = getClientIp(request);
    if (!ip) throw new ParseError(Error("Failed to get client IP"));

    await ratelimit.limit(key ? `${ip}:${key}` : ip);
}
