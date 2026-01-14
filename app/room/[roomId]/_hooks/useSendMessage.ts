import { Message } from "@/lib/db/schema";
import { api } from "@/lib/lib";
import { BackendError } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import { startTransition } from "react";
import { toast } from "sonner";
import { useRoomInteraction } from "../_components/RoomInteractionProvider";
import { useRoom } from "../_components/RoomProvider";

export function useSendMessage(message: string) {
    const { room } = useRoom();
    const { addOptimisticMessage, removeOptimisticMessage } =
        useRoomInteraction();

    return useMutation({
        mutationFn: ({
            ciphertext,
            iv,
        }: Pick<Message, "ciphertext" | "iv">) => {
            if (!room) throw new Error("Waiting for data");

            return api.messages
                .send({ roomId: room.id })
                .post({ ciphertext, iv });
        },
        onMutate: ({ ciphertext, iv }) => {
            startTransition(() => {
                addOptimisticMessage({ ciphertext, iv, content: message });
            });
        },
        onSettled: (res, _, { ciphertext, iv }) => {
            const error = res?.error?.value as BackendError | undefined;
            if (error) {
                toast.error(error.message);
                removeOptimisticMessage(ciphertext, iv);
            }
        },
    });
}
