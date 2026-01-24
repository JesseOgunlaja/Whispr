"use client";

import { useStrictContext } from "@/hooks/useStrictContext";
import { Room } from "@/lib/db/schema";
import { ChildrenProps, SetRoom } from "@/lib/types";
import { createContext, useState } from "react";
import { useRoomJoiner } from "../_hooks/useRoomJoiner";

interface PropsType extends ChildrenProps {
    room: Room;
}

const RoomContext = createContext<{
    room: Room;
    setRoom: SetRoom;
} | null>(null);
export const useRoom = () => useStrictContext(RoomContext);

export default function RoomProvider({
    children,
    room: initialRoom,
}: PropsType) {
    const [room, setRoom] = useState(initialRoom);
    useRoomJoiner(room, setRoom);

    return (
        <RoomContext.Provider value={{ room, setRoom }}>
            {children}
        </RoomContext.Provider>
    );
}
