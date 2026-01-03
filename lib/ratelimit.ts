import { ParseError } from "elysia";
import { getClientIp } from "./server-lib";

export class RatelimitError extends Error {
    constructor() {
        super("Too many requests");
        this.name = "Ratelimit error";
    }
}

const ratelimitMap = new Map<string, number[]>();

setInterval(() => {
    const now = Date.now();
    for (const [key, timestamps] of ratelimitMap) {
        if (
            !timestamps.length ||
            timestamps[timestamps.length - 1] < now - 600_000
        ) {
            ratelimitMap.delete(key);
        }
    }
}, 60000).unref();

class Ratelimit {
    constructor(
        public config: {
            time: number;
            maxRequests: number;
            prefix: string;
        }
    ) {}

    limit(suffix: string) {
        const { time, maxRequests, prefix } = this.config;
        const key = `${prefix}:${suffix}`;
        const now = Date.now();

        const windowStart = now - time * 1000;
        const timestamps = ratelimitMap.get(key) ?? [];

        while (timestamps.length && timestamps[0] <= windowStart) {
            timestamps.shift();
        }

        if (timestamps.length >= maxRequests) throw new RatelimitError();

        timestamps.push(now);
        ratelimitMap.set(key, timestamps);
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

export function ratelimit(
    ratelimit: Ratelimit,
    request: Request,
    key?: string
) {
    const ip = getClientIp(request);
    if (!ip) throw new ParseError(Error("Failed to get client IP"));

    ratelimit.limit(key ? `${ip}:${key}` : ip);
}
