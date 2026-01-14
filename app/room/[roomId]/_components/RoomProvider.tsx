"use client";

import { useStrictContext } from "@/hooks/useStrictContext";
import { Room } from "@/lib/db/schema";
import { ChildrenProps } from "@/lib/types";
import { createContext, Dispatch, SetStateAction, useState } from "react";

interface PropsType extends ChildrenProps {
    room: Room;
}

const RoomContext = createContext<{
    room: Room;
    setRoom: Dispatch<SetStateAction<Room>>;
} | null>(null);
export const useRoom = () => useStrictContext(RoomContext);

export default function RoomProvider({
    children,
    room: initialRoom,
}: PropsType) {
    const [room, setRoom] = useState(initialRoom);

    return (
        <RoomContext.Provider value={{ room, setRoom }}>
            {children}
        </RoomContext.Provider>
    );
}
