import { useToastMutation } from "@/hooks/useToastMutation";
import { getPublicKeys } from "@/lib/crypto/keyManager";
import { Room } from "@/lib/db/schema";
import { api } from "@/lib/lib";
import { BackendError, SetRoom } from "@/lib/types";
import { produce } from "immer";
import { useRouter } from "next/navigation";

export function useJoinRoom(room: Room, setRoom: SetRoom) {
    const router = useRouter();

    return useToastMutation(
        {
            mutationFn: async () => {
                const { encryptionKey, signingKey } = await getPublicKeys();
                if (!encryptionKey || !signingKey) {
                    throw new Error("Waiting for data");
                }

                const { data, error } = await api.room
                    .join({ roomId: room.id })
                    .post({ encryptionKey, signingKey });

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
            onSuccess: ({ room }) => {
                setRoom((old) =>
                    produce(old, (draft) => {
                        draft.users = room.users;
                        draft.publicKeys = room.publicKeys;
                    }),
                );
            },
        },
        "Joining room...",
    );
}
