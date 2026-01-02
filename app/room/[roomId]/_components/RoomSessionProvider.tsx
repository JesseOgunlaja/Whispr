"use client";

import { useStrictContext } from "@/hooks/useStrictContext";
import { Room } from "@/lib/db/schema";
import { ChildrenProps, DecryptedMessage, Signature } from "@/lib/types";
import { createContext } from "react";
import { useOptimisticMessages } from "../_hooks/useOptimisticMessages";
import { useRealtime } from "../_hooks/useRealtime";
import { useRoomSessionData } from "../_hooks/useRoomSessionData";
import { useSharedKey } from "../_hooks/useSharedKey";
import { useSignature } from "../_hooks/useSignature";

interface RoomSession {
    userId: string | undefined;
    room: Room | undefined;
    sharedKey: CryptoKey | undefined;
    signature: Signature | undefined;
    optimisticMessages: DecryptedMessage[];
    addOptimisticMessage: (
        _message: Pick<DecryptedMessage, "ciphertext" | "iv" | "content">
    ) => void;
    removeOptimisticMessage: (ciphertext: string, iv: string) => void;
    removeDuplicatedMessages: () => void;
}

const RoomSessionContext = createContext<RoomSession | null>(null);
export const useRoomSession = () => useStrictContext(RoomSessionContext);

export default function RoomSessionProvider({ children }: ChildrenProps) {
    const signature = useSignature();
    const roomSession = useRoomSessionData(signature);
    const sharedKey = useSharedKey(roomSession.room, roomSession.userId);
    const optimisticMessagesController = useOptimisticMessages(roomSession);

    useRealtime(roomSession.userId, signature);

    return (
        <RoomSessionContext.Provider
            value={{
                signature,
                sharedKey,
                ...roomSession,
                ...optimisticMessagesController,
            }}
        >
            {children}
        </RoomSessionContext.Provider>
    );
}
