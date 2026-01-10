import { produce } from "immer";
import { toast } from "sonner";
import z from "zod";
import { RealtimeHandlers, RoomQueryData } from "./types";

export const handlers: RealtimeHandlers = {
    "user-joined": (data, { userId, roomId, queryClient }) => {
        const {
            userId: joinedUserId,
            encryptionKey,
            signingKey,
        } = userJoinedSchema.parse(JSON.parse(data));
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
        const message = newMessageSchema.parse(JSON.parse(data));
        queryClient.setQueryData(["room", roomId], (old: RoomQueryData) => {
            if (!old.data) return old;
            return produce(old, (draft) => {
                draft.data.room.messages.push(message);
            });
        });
    },
};

const userJoinedSchema = z.object({
    userId: z.string(),
    encryptionKey: z.string(),
    signingKey: z.string(),
});

const newMessageSchema = z.object({
    id: z.number(),
    createdAt: z.date(),
    roomId: z.string(),
    ciphertext: z.string(),
    userId: z.string(),
    iv: z.string(),
});
