"use client";

import { encryptMessage } from "@/lib/crypto/encryption";
import { FormEvent, useRef, useState } from "react";
import { useSendMessage } from "../_hooks/useSendMessage";
import { useRoomSession } from "./RoomSessionProvider";

export default function SendMessage() {
    const inputRef = useRef<HTMLInputElement>(null);
    const { room, userId, signature, sharedKey } = useRoomSession();
    const [message, setMessage] = useState("");
    const { mutateAsync: sendMessage } = useSendMessage(message);

    async function formSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const trimmed = message.trim();
        if (!isFormDisabled && trimmed) {
            const { iv, ciphertext } = await encryptMessage(sharedKey, trimmed);
            sendMessage({ ciphertext, iv });

            setMessage("");
            inputRef.current?.focus();
        }
    }

    const isFormDisabled =
        room?.users.length !== 2 || !signature || !userId || !sharedKey;

    return (
        <footer>
            <form onSubmit={formSubmit}>
                <input
                    disabled={isFormDisabled}
                    autoFocus
                    placeholder={
                        room?.users.length === 2
                            ? "Send a message"
                            : !signature
                            ? "Loading"
                            : "Waiting for second user to join"
                    }
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    ref={inputRef}
                />
                <button disabled={isFormDisabled} type="submit">
                    Send
                </button>
            </form>
        </footer>
    );
}
