import { createRoom, deleteRoom, updateRoom } from "@/lib/db/dal";
import { isLikelyBase64Key, nanoid } from "@/lib/lib";
import { ratelimit, roomRatelimit } from "@/lib/ratelimit";
import { createWebsocketStream } from "@/lib/server-lib";
import { Elysia, t } from "elysia";
import { AuthError, isUserAuthorized, loadRoom, loadUser } from "./auth";

export const rooms = new Elysia({ prefix: "/room" })
    .use(loadUser)
    .post(
        "/create",
        async ({ body, userId, request }) => {
            ratelimit(roomRatelimit, request);

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
            ratelimit(roomRatelimit, request, room.id);

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

            return { success: true, room, userId };
        },
        {
            query: t.Object({
                encryptionKey: t.String(),
                signingKey: t.String(),
            }),
            async afterResponse({ room, userId, query }) {
                const { encryptionKey, signingKey } = query;
                const stream = await createWebsocketStream();
                stream.send(
                    room.id,
                    "user-joined",
                    JSON.stringify({ userId, encryptionKey, signingKey })
                );
            },
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
            async afterResponse({ room }) {
                const stream = await createWebsocketStream();
                stream.send(room.id, "room-destroyed", "");
            },
        }
    );
