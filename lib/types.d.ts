import { Dispatch, SetStateAction } from "react";
import z from "zod";
import { Message, Room } from "./db/schema";
import { api } from "./lib";
import { clientSocketMessageSchema } from "./realtime";

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

export type SetRoom = Dispatch<SetStateAction<Room>>;

export type RealtimeHandlerContext = {
    userId: string;
    setRoom: SetRoom;
    router: AppRouterInstance;
};

export type RealtimeHandlers = {
    [K in z.infer<typeof clientSocketMessageSchema>["type"]]: (
        payload: Extract<
            z.infer<typeof clientSocketMessageSchema>,
            { type: K }
        >["payload"],
        ctx: RealtimeHandlerContext,
    ) => void;
};
