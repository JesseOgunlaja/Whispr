import { getSharedEncryptionKey } from "@/lib/crypto/encryption";
import { Room } from "@/lib/db/schema";
import { useQuery } from "@tanstack/react-query";

export function useSharedKey(room?: Room, userId?: string) {
    const otherUserId = room?.users.find((uId) => uId !== userId);
    const otherPublicKey =
        otherUserId && room?.publicKeys[otherUserId]?.encryptionKey;

    const { data } = useQuery({
        queryKey: ["shared-key", room?.id, otherPublicKey],
        queryFn: () => {
            return getSharedEncryptionKey(otherPublicKey!, room!.id);
        },
        enabled: !!room && !!otherPublicKey,
    });

    return data;
}
