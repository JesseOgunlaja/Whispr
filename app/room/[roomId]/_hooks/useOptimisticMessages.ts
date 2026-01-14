import { useUserId } from "@/app/_components/UserIdProvider";
import { Room } from "@/lib/db/schema";
import { DecryptedMessage } from "@/lib/types";
import { useState } from "react";

export function useOptimisticMessages(room?: Room) {
    const { userId } = useUserId();
    const [optimisticMessages, setOptimisticMessages] = useState<
        DecryptedMessage[]
    >([]);

    function addOptimisticMessage(
        message: Pick<DecryptedMessage, "ciphertext" | "iv" | "content">
    ) {
        if (!room) return;

        setOptimisticMessages((current) => [
            ...current,
            {
                ...message,
                id: Math.random(),
                createdAt: new Date(),
                roomId: room!.id,
                userId: userId,
            },
        ]);
    }

    function removeOptimisticMessage(ciphertext: string, iv: string) {
        setOptimisticMessages((current) =>
            current.filter(
                (message) =>
                    message.ciphertext !== ciphertext && message.iv !== iv
            )
        );
    }

    function removeDuplicatedMessages() {
        if (!room) return;

        const messageHashes = new Set(
            room.messages.map(
                (message) => `${message.ciphertext}-${message.iv}`
            )
        );
        setOptimisticMessages((current) =>
            current.filter((message) => {
                return !messageHashes.has(
                    `${message.ciphertext}-${message.iv}`
                );
            })
        );
    }

    return {
        optimisticMessages,
        addOptimisticMessage,
        removeOptimisticMessage,
        removeDuplicatedMessages,
    };
}
