import { Message } from "@/lib/db/schema";
import { env } from "@/lib/env";
import { api } from "@/lib/lib";
import { RoomQueryData, Signature } from "@/lib/types";
import { useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
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

                stream.receive("user-joined", (data) => {
                    const {
                        userId: joinedUserId,
                        encryptionKey,
                        signingKey,
                    } = JSON.parse(data) as {
                        userId: string;
                        encryptionKey: string;
                        signingKey: string;
                    };
                    if (userId === joinedUserId) return;

                    toast.info(
                        `User ${joinedUserId.slice(0, 5)} joined the room`
                    );

                    queryClient.setQueryData(
                        ["room", roomId],
                        (old: RoomQueryData) => {
                            if (!old.data) return old;
                            return produce(old, (draft) => {
                                draft.data.room.users.push(joinedUserId);
                                draft.data.room.publicKeys[joinedUserId] = {
                                    encryptionKey,
                                    signingKey,
                                };
                            });
                        }
                    );
                });

                stream.receive("room-destroyed", () => {
                    router.push("/?info=Room destroyed");
                });

                stream.receive("new-message", (rawMessage) => {
                    const message = JSON.parse(rawMessage) as Message;

                    queryClient.setQueryData(
                        ["room", roomId],
                        (old: RoomQueryData) => {
                            if (!old.data) return old;
                            return produce(old, (draft) => {
                                draft.data.room.messages.push(message);
                            });
                        }
                    );
                });
            });

        return () => stream?.disconnect();
    }, [userId, roomId, signature]);
}
