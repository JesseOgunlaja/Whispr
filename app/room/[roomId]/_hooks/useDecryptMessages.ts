import { decryptMessage } from "@/lib/crypto/encryption";
import { DecryptedMessage } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import { useRoomInteraction } from "../_components/RoomInteractionProvider";
import { useRoom } from "../_components/RoomProvider";

export function useDecryptMessages() {
    const decryptedMessagesCache = useRef(new Map<string, string>());
    const [messages, setMessages] = useState<DecryptedMessage[]>([]);
    const { room } = useRoom();
    const { sharedKey, removeDuplicatedMessages } = useRoomInteraction();

    useEffect(() => {
        if (room?.users.length !== 2 || !sharedKey) return;

        (async () => {
            const messages = await Promise.all(
                room.messages.map(async (message) => {
                    const { ciphertext, iv } = message;
                    const messageKey = `${message.ciphertext}-${message.iv}`;
                    const cachedContent =
                        decryptedMessagesCache.current.get(messageKey);

                    if (cachedContent) {
                        return { ...message, content: cachedContent };
                    }

                    const content = await decryptMessage(
                        sharedKey,
                        ciphertext,
                        iv
                    );

                    decryptedMessagesCache.current.set(messageKey, content);

                    return { ...message, content };
                })
            );

            removeDuplicatedMessages();
            setMessages(messages);
        })();
    }, [room, sharedKey, removeDuplicatedMessages]);

    return messages;
}
