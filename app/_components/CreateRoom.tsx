"use client";

import { useToastMutation } from "@/hooks/useToastMutation";
import { getPublicKeys } from "@/lib/crypto/keyManager";
import { api } from "@/lib/lib";
import { BackendError } from "@/lib/types";
import { useRouter } from "next/navigation";

export default function CreateRoom() {
    const router = useRouter();
    const { mutate: createRoom, isPending } = useToastMutation(
        {
            mutationFn: async () => {
                const { encryptionKey, signingKey } = await getPublicKeys();

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
        "Creating room...",
    );

    return (
        <button onClick={createRoom} disabled={isPending}>
            Create Room
        </button>
    );
}
