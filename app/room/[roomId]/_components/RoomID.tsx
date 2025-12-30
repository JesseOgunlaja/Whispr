"use client";

import { useEffect, useState } from "react";
import { useRoomId } from "../_hooks/useRoomId";

export default function RoomID() {
    const roomId = useRoomId();
    const [copied, setCopied] = useState(false);

    function copyRoomId() {
        navigator.clipboard.writeText(
            `${window.location.origin}/room/${roomId}`
        );

        setCopied(true);
    }

    useEffect(() => {
        if (!copied) return;

        const t = setTimeout(() => setCopied(false), 2000);
        return () => clearTimeout(t);
    }, [copied]);

    if (!roomId) return null;
    return (
        <div>
            <p>{roomId}</p>
            <button onClick={copyRoomId} disabled={copied}>
                {copied ? "COPIED" : "COPY"}
            </button>
        </div>
    );
}
