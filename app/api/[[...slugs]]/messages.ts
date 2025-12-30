import { createMessage } from "@/lib/db/dal";
import { messageRatelimit, ratelimit } from "@/lib/ratelimit";
import { createWebsocketStream } from "@/lib/server-lib";
import { Elysia, t } from "elysia";
import { isUserAuthorized } from "./auth";

export const messages = new Elysia({ prefix: "/messages" })
    .use(isUserAuthorized)
    .post(
        "/send/:roomId",
        async ({ body, room, userId, request }) => {
            const { ciphertext, iv } = body;

            await ratelimit(messageRatelimit, request, room.id);

            const message = {
                ciphertext,
                iv,
                roomId: room.id,
                userId,
            };

            const stream = await createWebsocketStream();

            const { createdAt, id } = await createMessage(message);

            stream.send(
                room.id,
                "new-message",
                JSON.stringify({ ...message, createdAt, id })
            );

            return { success: true };
        },
        {
            body: t.Object({
                ciphertext: t.String(),
                iv: t.String(),
            }),
        }
    );
