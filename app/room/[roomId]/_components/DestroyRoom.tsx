"use client";

import { useToastMutation } from "@/hooks/useToastMutation";
import { api } from "@/lib/lib";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRoomId } from "../_hooks/useRoomId";
import { useRoomSession } from "./RoomSessionProvider";

export default function DestroyRoom() {
    const roomId = useRoomId();
    const router = useRouter();
    const { signature } = useRoomSession();
    const { mutate: deleteRoom, isPending: isDeleting } = useToastMutation(
        {
            mutationFn: async () => {
                if (!roomId || !signature) throw new Error("Waiting for data");

                const { data } = await api.room
                    .destroy({ roomId })
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
        <button
            disabled={isDeleting || !roomId || !signature}
            onClick={deleteRoom}
        >
            <Trash2 />
            <p>Destroy Room</p>
        </button>
    );
}
