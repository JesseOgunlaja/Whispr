import { produce } from "immer";
import { toast } from "sonner";
import z from "zod";
import { RealtimeHandlers } from "./types";

export const handlers: RealtimeHandlers = {
    "user-joined": (data, { userId, setRoom }) => {
        const { userId: joinedUserId, encryptionKey, signingKey } = data;
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
    "room-destroyed": (_, { router }) => {
        router.push("/?info=Room destroyed");
    },
    "new-message": (message, { setRoom }) => {
        setRoom((old) => {
            return produce(old, (draft) => {
                draft.messages.push(message);
            });
        });
    },
    error: (error) => {
        if (typeof error === "string") toast.error(error);
    },
};

export const clientSocketMessageSchema = z.discriminatedUnion("type", [
    z.object({
        type: z.literal("user-joined"),
        payload: z.object({
            userId: z.string(),
            encryptionKey: z.string(),
            signingKey: z.string(),
        }),
    }),
    z.object({
        type: z.literal("room-destroyed"),
        payload: z.string(),
    }),
    z.object({
        type: z.literal("new-message"),
        payload: z.object({
            id: z.number(),
            createdAt: z.string().transform((str) => new Date(str)),
            roomId: z.string(),
            ciphertext: z.string(),
            userId: z.string(),
            iv: z.string(),
        }),
    }),
    z.object({
        type: z.literal("error"),
        payload: z.string(),
    }),
]);
