import { env } from "@/lib/env";
import { api } from "@/lib/lib";
import { handlers } from "@/lib/realtime";
import { Signature } from "@/lib/types";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ClientStream, createClientStream } from "streamthing";
import { useRoomId } from "./useRoomId";

export function useRealtime(
    userId: string | undefined,
    signature: Signature | undefined
) {
    const roomId = useRoomId();
    const router = useRouter();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!userId || !signature || !roomId) return;

        let stream: ClientStream | null = null;
        api.realtime
            .token({ roomId })
            .get({ query: signature })
            .then(({ data }) => {
                if (!data?.success) return;

                stream = createClientStream({
                    region: env.NEXT_PUBLIC_STREAMTHING_SERVER_REGION,
                    token: data.token,
                    id: env.NEXT_PUBLIC_STREAMTHING_SERVER_ID,
                });

                Object.entries(handlers).forEach(([event, handler]) => {
                    stream?.receive(event, (payload) =>
                        handler(payload, {
                            userId,
                            roomId,
                            queryClient,
                            router,
                        })
                    );
                });
            });

        return () => stream?.disconnect();
    }, [userId, roomId, signature, queryClient, router]);
}
