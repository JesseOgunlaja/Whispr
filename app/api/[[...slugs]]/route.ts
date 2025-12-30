import { globalRatelimit, ratelimit, RatelimitError } from "@/lib/ratelimit";
import { Elysia } from "elysia";
import { AuthError } from "./auth";
import { messages } from "./messages";
import { realtime } from "./realtime";
import { rooms } from "./rooms";
import { users } from "./user";

export const app = new Elysia({ prefix: "/api" })
    .error({ AUTH: AuthError, RATELIMIT: RatelimitError })
    .onError(({ set, code, error }) => {
        switch (code) {
            case "AUTH":
                set.status = 401;
                return { type: "auth", message: error.message };
            case "RATELIMIT":
                set.status = 429;
                return {
                    type: "ratelimit",
                    message: "Too many requests, try again later",
                };
            case "VALIDATION":
            case "PARSE":
            case "INVALID_COOKIE_SIGNATURE":
            case "INVALID_FILE_TYPE":
                set.status = 422;
                return { type: "validation", message: error.message };
            default:
                if (error instanceof Error) {
                    return { type: "unknown", message: error.message };
                } else return { type: "unknown", message: error };
        }
    })
    .derive({ as: "global" }, async ({ request }) => {
        await ratelimit(globalRatelimit, request);
    })
    .use(users)
    .use(rooms)
    .use(realtime)
    .use(messages);

export type App = typeof app;
export const GET = app.fetch;
export const POST = app.fetch;
