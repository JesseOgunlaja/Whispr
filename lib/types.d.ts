import { Message } from "./db/schema";
import { api } from "./lib";

export interface DecryptedMessage extends Message {
    content: string;
}

export type RoomsQueryData = Awaited<ReturnType<typeof api.user.rooms.get>>;
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

export type RealtimeHandler = (
    payload: string,
    ctx: {
        userId: string;
        roomId: string;
        queryClient: QueryClient;
        router: AppRouterInstance;
    }
) => void;
