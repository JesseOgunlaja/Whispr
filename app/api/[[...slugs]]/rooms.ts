import { ROOM_TTL_MINUTES } from "@/lib/constants";
import {
    createRoom,
    deleteExpiredRooms,
    deleteRoom,
    EXPIRY_LIST_KEY,
    updateRoom,
} from "@/lib/db/dal";
import { kv } from "@/lib/db/db";
import { isLikelyBase64Key, nanoid } from "@/lib/lib";
import { ratelimit, roomRatelimit } from "@/lib/ratelimit";
import { createWebsocketStream } from "@/lib/server-lib";
import { Elysia, t } from "elysia";
import { AuthError, isUserAuthorized, loadRoom, loadUser } from "./auth";

export const rooms = new Elysia({ prefix: "/room" })
    .get("/cleanup", async () => {
        const expiredRooms = await kv.zrange<string[]>(
            EXPIRY_LIST_KEY,
            0,
            Date.now(),
            { byScore: true }
        );

        if (expiredRooms.length === 0) return { success: true, cleaned: 0 };

        const pipeline = kv.pipeline();
        expiredRooms.forEach((roomId) =>
            pipeline.zrem(EXPIRY_LIST_KEY, roomId)
        );

        await Promise.all([pipeline.exec(), deleteExpiredRooms()]);

        return { success: true, cleaned: expiredRooms.length };
    })
    .use(loadUser)
    .post(
        "/create",
        async ({ body, userId, request }) => {
            await ratelimit(roomRatelimit, request);

            const roomId = nanoid();
            const { encryptionKey, signingKey } = body;

            await createRoom({
                id: roomId,
                users: [userId],
                publicKeys: {
                    [userId]: {
                        encryptionKey,
                        signingKey,
                    },
                },
            });

            return { success: true, roomId };
        },
        {
            async afterResponse({ responseValue }) {
                if (
                    typeof responseValue == "object" &&
                    responseValue &&
                    "roomId" in responseValue
                ) {
                    const { roomId } = responseValue as { roomId: string };
                    await kv.zadd(EXPIRY_LIST_KEY, {
                        score: Date.now() + ROOM_TTL_MINUTES * 60 * 1000,
                        member: roomId,
                    });
                }
            },
            body: t.Object({
                encryptionKey: t.String(),
                signingKey: t.String(),
            }),
        }
    )
    .use(loadRoom)
    .post(
        "/join/:roomId",
        async ({ room, userId, query, request }) => {
            if (room.users.includes(userId)) return { success: true };
            if (room.users.length > 1) throw new AuthError("Room full");
            await ratelimit(roomRatelimit, request, room.id);

            const { encryptionKey, signingKey } = query;

            if (
                !isLikelyBase64Key(encryptionKey) ||
                !isLikelyBase64Key(signingKey)
            ) {
                throw new AuthError("Invalid public key");
            }

            room.users.push(userId);
            room.publicKeys[userId] = {
                encryptionKey,
                signingKey,
            };
            await updateRoom(
                {
                    users: room.users,
                    publicKeys: room.publicKeys,
                },
                room.id
            );

            const stream = createWebsocketStream();
            stream.send(
                room.id,
                "user-joined",
                JSON.stringify({ userId, encryptionKey, signingKey })
            );

            return { success: true, room, userId };
        },
        {
            query: t.Object({
                encryptionKey: t.String(),
                signingKey: t.String(),
            }),
        }
    )
    .use(isUserAuthorized)
    .get("/:roomId", async ({ room, userId }) => {
        return { success: true, room, userId };
    })
    .post(
        "/destroy/:roomId",
        async ({ room }) => {
            await deleteRoom(room.id);
            return { success: true };
        },
        {
            async afterResponse({ room, userId }) {
                const stream = createWebsocketStream();
                stream.send(room.id, "room-destroyed", userId);

                await kv.zrem(EXPIRY_LIST_KEY, room.id);
            },
        }
    );
