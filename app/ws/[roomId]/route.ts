import { createMessage, deleteRoom } from "@/lib/db/dal";
import { messageRatelimit, ratelimit } from "@/lib/ratelimit";
import { RouteContext } from "next-ws/server";
import { NextRequest } from "next/server";
import { WebSocket, WebSocketServer } from "ws";
import {
    authenticate,
    parseRawData,
    publish,
    serverSocketMessageSchema,
    subscribe,
    tryCatch,
} from "./helpers";

export function GET() {
    const headers = new Headers();
    headers.set("Connection", "Upgrade");
    headers.set("Upgrade", "websocket");
    return new Response("Upgrade Required", { status: 426, headers });
}

export async function UPGRADE(
    client: WebSocket,
    _server: WebSocketServer,
    request: NextRequest,
    { params: { roomId } }: RouteContext<"/ws/[roomId]">,
) {
    const userId = await authenticate(request, roomId).catch((error) => {
        console.log(error);
        client.send(
            JSON.stringify({
                type: "error",
                message:
                    error instanceof Error ? error.message : "Unauthorized",
            }),
        );
        client.close();
    });

    if (!userId) return;

    const sp = Object.fromEntries(request.nextUrl.searchParams.entries());
    if ("hasJoined" in sp) {
        publish(roomId, {
            type: "user-joined",
            payload: {
                userId,
                encryptionKey: sp.encryptionKey,
                signingKey: sp.signingKey,
            },
        });
    }

    subscribe(roomId, client);
    client.on("message", async (rawData) => {
        const { type: eventType, data } = serverSocketMessageSchema.parse(
            JSON.parse(parseRawData(rawData)),
        );
        switch (eventType) {
            case "message":
                tryCatch(client, async () => {
                    const { ciphertext, iv } = data;
                    await ratelimit(messageRatelimit, request, roomId);
                    const message = await createMessage({
                        iv,
                        roomId,
                        userId,
                        ciphertext,
                    });

                    publish(roomId, {
                        type: "new-message",
                        payload: message,
                    });
                });
                break;
            case "room-deleted":
                tryCatch(client, async () => {
                    console.time("delete room");
                    await deleteRoom(roomId);
                    console.timeEnd("delete room");

                    publish(roomId, {
                        type: "room-destroyed",
                        payload: "",
                    });
                });
                break;
        }
    });
}
