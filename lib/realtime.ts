import { produce } from "immer";
import { toast } from "sonner";
import z from "zod";
import { RealtimeHandlers } from "./types";

export const handlers: RealtimeHandlers = {
    "user-joined": (data, { userId, setRoom }) => {
        const {
            userId: joinedUserId,
            encryptionKey,
            signingKey,
        } = userJoinedSchema.parse(JSON.parse(data));
        if (userId === joinedUserId) return;

        toast.info(`User ${joinedUserId.slice(0, 5)} joined the room`);

        setRoom((old) => {
            return produce(old, (draft) => {
                draft.users.push(joinedUserId);
                draft.publicKeys[joinedUserId] = {
                    encryptionKey,
                    signingKey,
                };
            });
        });
    },
    "room-destroyed": (actor, { router, userId }) => {
        if (actor !== userId) router.push("/?info=Room destroyed");
    },
    "new-message": (data, { setRoom }) => {
        const message = newMessageSchema.parse(JSON.parse(data));
        setRoom((old) => {
            return produce(old, (draft) => {
                draft.messages.push(message);
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
    createdAt: z.string().transform((str) => new Date(str)),
    roomId: z.string(),
    ciphertext: z.string(),
    userId: z.string(),
    iv: z.string(),
});
