import { usePublicKeys } from "@/app/_components/PublicKeysProvider";
import { useToastMutation } from "@/hooks/useToastMutation";
import { api } from "@/lib/lib";
import { RoomQueryData } from "@/lib/types";
import { useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";
import { useRouter } from "next/navigation";
import { useRoomId } from "./useRoomId";

export function useJoinRoom() {
    const router = useRouter();
    const roomId = useRoomId();
    const { encryptionKey, signingKey } = usePublicKeys();
    const queryClient = useQueryClient();

    return useToastMutation(
        {
            mutationFn: async () => {
                if (!encryptionKey || !signingKey || !roomId) {
                    throw new Error("Waiting for data");
                }

                const { data } = await api.room.join({ roomId }).post(null, {
                    query: {
                        encryptionKey,
                        signingKey,
                    },
                });

                if (!data?.room) {
                    throw new Error("Failed to join room, redirecting...");
                }

                return {
                    message: "Joined room",
                    ...data,
                };
            },
            onError: () => router.push("/?error=Failed to join room"),
            onSuccess: (data) => {
                queryClient.setQueryData(
                    ["room", roomId],
                    (old: RoomQueryData) => {
                        const next = produce(old, (draft) => {
                            draft.data = {
                                success: true,
                                room: data.room,
                                userId: data.userId,
                            };
                            draft.error = null;
                        });

                        return next satisfies RoomQueryData;
                    }
                );
            },
        },
        "Joining room..."
    );
}
