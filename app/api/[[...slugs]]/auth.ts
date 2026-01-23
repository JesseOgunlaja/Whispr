import { decodeJWT } from "@/lib/auth";
import { verifySignature } from "@/lib/crypto/signing";
import { getRoomById } from "@/lib/db/dal";
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

export const loadRoom = new Elysia({ name: "load-room" })
    .guard({
        params: t.Object({ roomId: t.String() }),
    })
    .derive(async ({ params: { roomId } }) => {
        const room = await getRoomById(roomId, false);
        if (!room) throw new AuthError("Room not found");

        return { room };
    })
    .as("scoped");

export const isUserInRoom = new Elysia({ name: "user-in-room" })
    .use(loadUser)
    .use(loadRoom)
    .derive(async ({ room, userId }) => {
        if (!room.users.includes(userId)) {
            throw new AuthError("User not in room");
        }
    })
    .as("scoped");

export const isUserAuthorized = new Elysia({ name: "user-authorized" })
    .use(loadUser)
    .use(loadRoom)
    .use(isUserInRoom)
    .guard({
        query: t.Object({
            signature: t.String(),
            window: t.String(),
        }),
    })
    .derive(async ({ room, userId, query }) => {
        const validSignature = await verifySignature(
            query.signature,
            room.publicKeys[userId].signingKey,
            query.window,
            room.id,
        );

        if (!validSignature) throw new AuthError("Invalid signature");
    })
    .as("scoped");
