"use client";

import { useToastMutation } from "@/hooks/useToastMutation";
import { createSignature } from "@/lib/crypto/signing";
import { api } from "@/lib/lib";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRoom } from "./RoomProvider";

export default function DestroyRoom() {
    const router = useRouter();
    const { room } = useRoom();
    const { mutate: deleteRoom, isPending: isDeleting } = useToastMutation(
        {
            mutationFn: async () => {
                const signature = await createSignature(room.id);

                const { data } = await api.room
                    .destroy({ roomId: room.id })
                    .post(null, { query: signature });

                if (!data?.success) throw new Error("Failed to destroy room");

                return {
                    message: "Room successfully destroyed",
                };
            },
            onSuccess: () => router.push("/"),
        },
        "Destroying room..."
    );

    return (
        <button disabled={isDeleting} onClick={deleteRoom}>
            <Trash2 />
            <p>Destroy Room</p>
        </button>
    );
}
