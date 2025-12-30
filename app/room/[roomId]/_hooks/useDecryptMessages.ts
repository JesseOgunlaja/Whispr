import { decryptMessage } from "@/lib/crypto/encryption";
import { DecryptedMessage } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import { useRoomSession } from "../_components/RoomSessionProvider";

export function useDecryptMessages() {
    const decryptedMessagesCache = useRef(new Map<string, string>());
    const [messages, setMessages] = useState<DecryptedMessage[]>([]);
    const { room, userId, sharedKey, removeDuplicatedMessages } =
        useRoomSession();

    useEffect(() => {
        if (!room?.messages || room.users.length !== 2 || !userId || !sharedKey)
            return;

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
    }, [room, userId, sharedKey, removeDuplicatedMessages]);

    return messages;
}
