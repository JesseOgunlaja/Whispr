import { useToastMutation } from "@/hooks/useToastMutation";
import { getPublicKeys } from "@/lib/crypto/keyManager";
import { api } from "@/lib/lib";
import { BackendError } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useRoom } from "../_components/RoomProvider";

export function useJoinRoom() {
    const router = useRouter();
    const { room, setRoom } = useRoom();

    return useToastMutation(
        {
            mutationFn: async () => {
                const { encryptionKey, signingKey } = await getPublicKeys();
                if (!encryptionKey || !signingKey) {
                    throw new Error("Waiting for data");
                }

                const { data, error } = await api.room
                    .join({ roomId: room.id })
                    .post(null, {
                        query: {
                            encryptionKey,
                            signingKey,
                        },
                    });

                if (!data?.room || error) {
                    const parsedError = error?.value as BackendError;
                    if (
                        parsedError.type === "ratelimit" ||
                        parsedError.type === "auth"
                    ) {
                        throw new Error(parsedError.message);
                    }
                    throw new Error("Failed to join room");
                }

                return {
                    message: "Joined room",
                    ...data,
                };
            },
            onError: () => router.push("/"),
            onSuccess: (data) => {
                setRoom(data.room);
            },
        },
        "Joining room..."
    );
}
