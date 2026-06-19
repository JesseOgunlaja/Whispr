import { getTokenCookieConfig, signJWT } from "@/lib/auth";
import { nanoid } from "@/lib/lib";
import { Elysia } from "elysia";

export const users = new Elysia({ prefix: "/user" }).post(
    "/reset",
    async ({ cookie }) => {
        const userId = nanoid();
        cookie.token.set(getTokenCookieConfig(await signJWT({ userId })));

        return { userId };
    },
);
