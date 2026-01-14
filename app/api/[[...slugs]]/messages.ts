import { createMessage } from "@/lib/db/dal";
import { messageRatelimit, ratelimit } from "@/lib/ratelimit";
import { createWebsocketStream, runInBackground } from "@/lib/server-lib";
import { Elysia, t } from "elysia";
import { isUserInRoom } from "./auth";

export const messages = new Elysia({ prefix: "/messages" })
    .use(isUserInRoom)
    .post(
        "/send/:roomId",
        async ({ body, room, userId, request }) => {
            const { ciphertext, iv } = body;

            const stream = createWebsocketStream();
            await ratelimit(messageRatelimit, request, room.id);

            const message = {
                ciphertext,
                iv,
                roomId: room.id,
                userId,
            };

            const { createdAt, id } = await createMessage(message);

            runInBackground(async () => {
                (await stream).send(
                    room.id,
                    "new-message",
                    JSON.stringify({ ...message, createdAt, id })
                );
            });

            return { success: true };
        },
        {
            body: t.Object({
                ciphertext: t.String(),
                iv: t.String(),
            }),
        }
    );
