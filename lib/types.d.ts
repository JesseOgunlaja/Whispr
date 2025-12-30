import { Message } from "./db/schema";
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
