import { produce } from "immer";
import { toast } from "sonner";
import { Message } from "./db/schema";
import { RealtimeHandler, RoomQueryData } from "./types";

export const handlers = {
    "user-joined": (data, { userId, roomId, queryClient }) => {
        const {
            userId: joinedUserId,
            encryptionKey,
            signingKey,
        } = JSON.parse(data) as Record<string, string>;
        if (userId === joinedUserId) return;

        toast.info(`User ${joinedUserId.slice(0, 5)} joined the room`);

        queryClient.setQueryData(["room", roomId], (old: RoomQueryData) => {
            if (!old.data) return old;
            return produce(old, (draft) => {
                draft.data.room.users.push(joinedUserId);
                draft.data.room.publicKeys[joinedUserId] = {
                    encryptionKey,
                    signingKey,
                };
            });
        });
    },
    "room-destroyed": (_, { router }) => {
        router.push("/?info=Room destroyed");
    },
    "new-message": (data, { roomId, queryClient }) => {
        const message = JSON.parse(data) as Message;

        queryClient.setQueryData(["room", roomId], (old: RoomQueryData) => {
            if (!old.data) return old;
            return produce(old, (draft) => {
                draft.data.room.messages.push(message);
            });
        });
    },
} satisfies Record<string, RealtimeHandler>;
