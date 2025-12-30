"use client";

import { useToastMutation } from "@/hooks/useToastMutation";
import { api } from "@/lib/lib";
import { BackendError } from "@/lib/types";
import { useRouter } from "next/navigation";
import { usePublicKeys } from "./PublicKeysProvider";

export default function CreateRoom() {
    const router = useRouter();
    const { encryptionKey, signingKey } = usePublicKeys();
    const { mutate: createRoom, isPending } = useToastMutation(
        {
            mutationFn: async () => {
                if (!encryptionKey || !signingKey) {
                    throw new Error("Waiting for keys");
                }

                const res = await api.room.create.post({
                    encryptionKey,
                    signingKey,
                });

                if (res.error?.value) {
                    const error = res.error.value as BackendError;
                    if (error.type == "ratelimit") {
                        throw new Error(error.message);
                    } else throw new Error("Failed to create room");
                }

                return {
                    ...res.data,
                    message: "Room created",
                };
            },
            onSuccess: ({ roomId }) => router.push(`/room/${roomId}`),
        },
        "Creating room..."
    );

    return (
        <button
            onClick={createRoom}
            disabled={!encryptionKey || !signingKey || isPending}
        >
            Create Room
        </button>
    );
}
