import { decodeJWT } from "@/lib/auth";
import { Elysia, t } from "elysia";

export class AuthError extends Error {
    constructor(public message: string) {
        super(message);
        this.name = "Auth error";
    }
}

export const loadUser = new Elysia({ name: "load-user" })
    .guard({
        cookie: t.Cookie({ token: t.String() }),
    })
    .derive(async ({ cookie, request }) => {
        const userId =
            request.headers.get("x-user-id") ??
            (await decodeJWT(cookie.token.value))?.userId;

        if (!userId) throw new AuthError("Invalid auth token");

        return { userId };
    })
    .as("scoped");
