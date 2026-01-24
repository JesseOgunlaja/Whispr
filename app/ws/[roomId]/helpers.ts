import { decodeJWT } from "@/lib/auth";
import { verifySignature } from "@/lib/crypto/signing";
import { getRoomById } from "@/lib/db/dal";
import { clientSocketMessageSchema } from "@/lib/realtime";
import { NextRequest } from "next/server";
import type WebSocket from "ws";
import z from "zod";

const topics = new Map<string, Set<WebSocket>>();

export async function authenticate(request: NextRequest, roomId: string) {
    const userId =
        request.headers.get("x-user-id") ??
        (await decodeJWT(request.cookies.get("token")?.value || ""))?.userId;
    if (!userId) throw new Error("Unauthorized");

    const room = await getRoomById(roomId, false);
    if (!room) throw new Error("Room not found");

    if (!room.users.includes(userId)) throw new Error("User not in room");

    const { signature, window } = Object.fromEntries(
        request.nextUrl.searchParams.entries(),
    );

    await verifySignature(
        signature,
        room.publicKeys[userId].signingKey,
        window,
        roomId,
    );

    return userId;
}

export function subscribe(topic: string, socket: WebSocket) {
    if (!topics.has(topic)) topics.set(topic, new Set());
    topics.get(topic)!.add(socket);

    socket.on("close", () => {
        const currentSubs = topics.get(topic);
        if (!currentSubs) return;

        currentSubs.delete(socket);
        if (currentSubs.size === 0) topics.delete(topic);
    });
}

export function publish(
    topic: string,
    data: z.infer<typeof clientSocketMessageSchema>,
    except?: WebSocket,
) {
    const subscribers = topics.get(topic);
    if (!subscribers) return;

    for (const socket of subscribers) {
        if (socket.readyState === socket.OPEN && socket !== except)
            socket.send(JSON.stringify(data));
    }
}

export const serverSocketMessageSchema = z.discriminatedUnion("type", [
    z.object({
        type: z.literal("message"),
        data: z.object({
            iv: z.string(),
            ciphertext: z.string(),
        }),
    }),
    z.object({
        type: z.literal("room-deleted"),
        data: z.null(),
    }),
]);

export function parseRawData(raw: WebSocket.RawData) {
    return raw.toString("utf-8");
}

export async function tryCatch(socket: WebSocket, fn: () => Promise<void>) {
    try {
        await fn();
    } catch (error) {
        socket.send(
            JSON.stringify({
                type: "error",
                payload:
                    error instanceof Error
                        ? error.message
                        : "Unexpected error occurred, please try again",
            } satisfies z.infer<typeof clientSocketMessageSchema>),
        );
    }
}
