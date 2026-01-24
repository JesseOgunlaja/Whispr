import { useUserId } from "@/app/_components/UserIdProvider";
import { serverSocketMessageSchema } from "@/app/ws/[roomId]/helpers";
import { getPublicKeys } from "@/lib/crypto/keyManager";
import { createSignature } from "@/lib/crypto/signing";
import { clientSocketMessageSchema, handlers } from "@/lib/realtime";
import { RealtimeHandlerContext } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import z from "zod";
import { useRoom } from "../_components/RoomProvider";

export function useRealtime() {
    const hasJoined = useRef(false);
    const router = useRouter();
    const { userId } = useUserId();
    const { setRoom, room } = useRoom();
    const socketRef = useRef<WebSocket | null>(null);

    function sendSocketMessage(
        data: z.infer<typeof serverSocketMessageSchema>,
    ) {
        const socket = socketRef?.current;
        if (!socket) return;

        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(data));
        } else socket.onopen = () => socket.send(JSON.stringify(data));
    }

    useEffect(() => {
        if (!room?.users.includes(userId)) {
            hasJoined.current = true;
            return;
        }

        let socket: WebSocket | null = null;
        (async () => {
            const { window, signature } = await createSignature(room.id);
            const signatureSp = `signature=${encodeURIComponent(signature)}&window=${encodeURIComponent(window)}`;
            if (hasJoined.current) {
                const { encryptionKey, signingKey } = await getPublicKeys();
                socket = new WebSocket(
                    `/ws/${room.id}?hasJoined&encryptionKey=${encodeURIComponent(encryptionKey)}&signingKey=${encodeURIComponent(signingKey)}&${signatureSp}`,
                );
            } else socket = new WebSocket(`/ws/${room.id}?${signatureSp}`);

            socketRef.current = socket;
            socket.onmessage = (event) => {
                const { type, payload } = clientSocketMessageSchema.parse(
                    JSON.parse(event.data),
                );

                const handler = handlers[type] as (
                    m: typeof payload,
                    c: RealtimeHandlerContext,
                ) => void;

                handler(payload, {
                    userId,
                    setRoom,
                    router,
                });
            };
        })();

        return () => socket?.close();
    }, [userId, router, setRoom, hasJoined, room.id, room.users]);

    return { sendSocketMessage };
}
