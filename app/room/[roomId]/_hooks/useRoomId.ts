"use client";

import { useEffect, useState } from "react";

export function useRoomId() {
    const [roomId, setRoomId] = useState<string | undefined>();

    useEffect(() => {
        const id = window.location.pathname.split("/").pop();
        if (typeof id !== "string") throw new Error("Invalid room ID");

        setRoomId(id);
    }, []);

    return roomId;
}
