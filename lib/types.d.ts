import { Dispatch, SetStateAction } from "react";
import { Message, Room } from "./db/schema";
import { api } from "./lib";

export interface DecryptedMessage extends Message {
    content: string;
}

export type RoomQueryData = Awaited<
    ReturnType<ReturnType<typeof api.room>["get"]>
>;

export interface BackendError {
    type: "auth" | "validation" | "ratelimit" | "unknown";
    message: string;
}

export type IDBKey = CryptoKey | null;

export type ChildrenProps = Readonly<{
    children: React.ReactNode;
}>;

export type Signature = {
    signature: string;
    window: string;
};

export type RealtimeHandlers = {
    [K in "user-joined" | "new-message" | "room-destroyed"]: (
        payload: string,
        ctx: {
            userId: string;
            setRoom: Dispatch<SetStateAction<Room>>;
            router: AppRouterInstance;
        }
    ) => void;
};
