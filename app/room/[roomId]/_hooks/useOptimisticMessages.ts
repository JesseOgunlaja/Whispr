import { Room } from "@/lib/db/schema";
import { DecryptedMessage } from "@/lib/types";
import { useState } from "react";

export function useOptimisticMessages(roomSession: {
    room: Room | undefined;
    userId: string | undefined;
}) {
    const [optimisticMessages, setOptimisticMessages] = useState<
        DecryptedMessage[]
    >([]);

    function addOptimisticMessage(
        message: Pick<DecryptedMessage, "ciphertext" | "iv" | "content">
    ) {
        if (!roomSession.room || !roomSession.userId) return;

        setOptimisticMessages((current) => [
            ...current,
            {
                ...message,
                id: Math.random(),
                createdAt: new Date(),
                roomId: roomSession.room!.id,
                userId: roomSession.userId!,
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
        if (!roomSession.room || !roomSession.userId) return;

        const messageHashes = new Set(
            roomSession.room.messages.map(
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
