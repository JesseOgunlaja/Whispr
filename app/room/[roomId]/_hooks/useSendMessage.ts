import { Message } from "@/lib/db/schema";
import { api } from "@/lib/lib";
import { BackendError } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import { startTransition } from "react";
import { toast } from "sonner";
import { useRoomSession } from "../_components/RoomSessionProvider";

export function useSendMessage(message: string) {
    const { room, signature, addOptimisticMessage, removeOptimisticMessage } =
        useRoomSession();

    return useMutation({
        mutationFn: ({
            ciphertext,
            iv,
        }: Pick<Message, "ciphertext" | "iv">) => {
            if (!room || !signature) throw new Error("Waiting for data");

            return api.messages
                .send({ roomId: room.id })
                .post({ ciphertext, iv }, { query: signature });
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
