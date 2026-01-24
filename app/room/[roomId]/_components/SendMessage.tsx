"use client";

import { encryptMessage } from "@/lib/crypto/encryption";
import { FormEvent, useRef, useState } from "react";
import { useRoom } from "../_components/RoomProvider";
import { useSharedKey } from "../_hooks/useSharedKey";
import { useRoomRealtime } from "./RoomRealtimeProvider";

export default function SendMessage() {
    const inputRef = useRef<HTMLInputElement>(null);
    const sharedKey = useSharedKey();
    const { sendSocketMessage } = useRoomRealtime();
    const { room } = useRoom();
    const [message, setMessage] = useState("");

    async function formSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const trimmed = message.trim();
        if (!isFormDisabled && trimmed) {
            const encrypted = await encryptMessage(sharedKey, trimmed);
            sendSocketMessage({ type: "message", data: encrypted });

            setMessage("");
            inputRef.current?.focus();
        }
    }

    const isFormDisabled = room?.users.length !== 2 || !sharedKey;

    return (
        <footer>
            <form onSubmit={formSubmit}>
                <input
                    disabled={isFormDisabled}
                    autoFocus
                    placeholder={
                        room?.users.length === 2
                            ? "Send a message"
                            : !room?.users.length
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
