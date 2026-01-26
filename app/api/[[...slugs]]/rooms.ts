import { createRoom, getRoomById, updateRoom } from "@/lib/db/dal";
import { nanoid } from "@/lib/lib";
import { ratelimit } from "@/lib/ratelimit";
import { Elysia, t } from "elysia";
import { AuthError, loadUser } from "./auth";

export const rooms = new Elysia({ prefix: "/room" })
    .use(loadUser)
    .guard({
        body: t.Object({
            encryptionKey: t.String(),
            signingKey: t.String(),
        }),
    })
    .post("/create", async ({ body, userId, request }) => {
        await ratelimit("room", request);

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
    })
    .post("/join/:roomId", async ({ userId, body, params }) => {
        const room = await getRoomById(params.roomId, false);
        if (!room) throw new AuthError("Room not found");

        if (room.users.includes(userId)) return { success: true };
        if (room.users.length > 1) throw new AuthError("Room full");

        const { encryptionKey, signingKey } = body;

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
            room.id,
        );

        return { success: true, room, userId };
    });
