import { useUserId } from "@/app/_components/UserIdProvider";
import { env } from "@/lib/env";
import { handlers } from "@/lib/realtime";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createClientStream } from "streamthing";
import { useRoom } from "../_components/RoomProvider";

export function useRealtime(realtimeToken: string) {
    const router = useRouter();
    const { userId } = useUserId();
    const { setRoom } = useRoom();

    useEffect(() => {
        const stream = createClientStream({
            region: env.NEXT_PUBLIC_STREAMTHING_SERVER_REGION,
            token: realtimeToken,
            id: env.NEXT_PUBLIC_STREAMTHING_SERVER_ID,
        });

        Object.entries(handlers).forEach(([event, handler]) => {
            stream.receive(event, (payload) => {
                try {
                    handler(payload, {
                        userId,
                        setRoom,
                        router,
                    });
                } catch (error) {
                    console.error(error);
                }
            });
        });

        return () => stream.disconnect();
    }, [userId, router]);
}
