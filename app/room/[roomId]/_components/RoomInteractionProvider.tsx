"use client";

import { useStrictContext } from "@/hooks/useStrictContext";
import { ChildrenProps, DecryptedMessage } from "@/lib/types";
import { createContext } from "react";
import { useOptimisticMessages } from "../_hooks/useOptimisticMessages";
import { useRoomInteractionController } from "../_hooks/useRoomSessionController";
import { useSharedKey } from "../_hooks/useSharedKey";

interface PropsType extends ChildrenProps {
    realtimeToken: string;
}

interface RoomSession {
    sharedKey?: CryptoKey;
    optimisticMessages: DecryptedMessage[];
    addOptimisticMessage: (
        _message: Pick<DecryptedMessage, "ciphertext" | "iv" | "content">
    ) => void;
    removeOptimisticMessage: (ciphertext: string, iv: string) => void;
    removeDuplicatedMessages: () => void;
}

const RoomInteractionContext = createContext<RoomSession | null>(null);
export const useRoomInteraction = () =>
    useStrictContext(RoomInteractionContext);

export default function RoomInteractionProvider({
    children,
    realtimeToken,
}: PropsType) {
    const sharedKey = useSharedKey();
    const optimisticMessagesController = useOptimisticMessages();

    useRoomInteractionController(realtimeToken);

    return (
        <RoomInteractionContext.Provider
            value={{
                sharedKey,
                ...optimisticMessagesController,
            }}
        >
            {children}
        </RoomInteractionContext.Provider>
    );
}
