"use client";

import { Trash2 } from "lucide-react";
import { useRoomRealtime } from "./RoomRealtimeProvider";

export default function DestroyRoom() {
    const { sendSocketMessage } = useRoomRealtime();

    function deleteRoom() {
        sendSocketMessage({ type: "room-deleted", data: null });
    }

    return (
        <button onClick={deleteRoom}>
            <Trash2 />
            <p>Destroy Room</p>
        </button>
    );
}
