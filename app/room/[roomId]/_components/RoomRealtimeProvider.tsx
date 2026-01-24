"use client";

import { serverSocketMessageSchema } from "@/app/ws/[roomId]/helpers";
import { useStrictContext } from "@/hooks/useStrictContext";
import { ChildrenProps } from "@/lib/types";
import { createContext } from "react";
import z from "zod";
import { useRealtime } from "../_hooks/useRealtime";

interface RoomSession {
    sendSocketMessage: (
        data: z.infer<typeof serverSocketMessageSchema>,
    ) => void;
}

const RoomRealtimeContext = createContext<RoomSession | null>(null);
export const useRoomRealtime = () => useStrictContext(RoomRealtimeContext);

export default function RoomRealtimeProvider({ children }: ChildrenProps) {
    const { sendSocketMessage } = useRealtime();

    return (
        <RoomRealtimeContext.Provider value={{ sendSocketMessage }}>
            {children}
        </RoomRealtimeContext.Provider>
    );
}
