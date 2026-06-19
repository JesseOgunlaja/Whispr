"use client";

import { useEffect, useState } from "react";
import { useRoom } from "./RoomProvider";

export default function RoomID() {
    const { room } = useRoom();
    const [copied, setCopied] = useState(false);

    function copyRoomId() {
        navigator.clipboard.writeText(
            `${window.location.origin}/room/${room.id}`,
        );

        setCopied(true);
    }

    useEffect(() => {
        if (!copied) return;

        const t = setTimeout(() => setCopied(false), 2000);
        return () => clearTimeout(t);
    }, [copied]);

    return (
        <div>
            <p>{room.id}</p>
            <button onClick={copyRoomId} disabled={copied}>
                {copied ? "COPIED" : "COPY"}
            </button>
        </div>
    );
}
