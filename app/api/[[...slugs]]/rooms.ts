import { createRoom, deleteRoom, updateRoom } from "@/lib/db/dal";
import { isLikelyBase64Key, nanoid } from "@/lib/lib";
import { ratelimit, roomRatelimit } from "@/lib/ratelimit";
import { createWebsocketStream, runInBackground } from "@/lib/server-lib";
import { Elysia, t } from "elysia";
import { AuthError, isUserAuthorized, loadRoom, loadUser } from "./auth";

export const rooms = new Elysia({ prefix: "/room" })
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
            const stream = createWebsocketStream();
            if (room.users.includes(userId)) return { success: true };
            if (room.users.length > 1) throw new AuthError("Room full");
            await ratelimit(roomRatelimit, request);

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

            runInBackground(async () => {
                (await stream).send(
                    room.id,
                    "user-joined",
                    JSON.stringify({ userId, encryptionKey, signingKey })
                );
            });

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
    .post("/destroy/:roomId", async ({ room, userId }) => {
        const stream = createWebsocketStream();
        await deleteRoom(room.id);

        runInBackground(async () => {
            (await stream).send(room.id, "room-destroyed", userId);
        });

        return { success: true };
    });
