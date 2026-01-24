import { useUserId } from "@/app/_components/UserIdProvider";
import { getSharedEncryptionKey } from "@/lib/crypto/encryption";
import { useQuery } from "@tanstack/react-query";
import { useRoom } from "../_components/RoomProvider";

export function useSharedKey() {
    const { userId } = useUserId();
    const { room } = useRoom();
    const otherUserId = room.users.find((uId) => uId !== userId);
    const otherPublicKey =
        otherUserId && room.publicKeys[otherUserId]?.encryptionKey;

    const { data: sharedKey } = useQuery({
        queryKey: ["shared-key", room.id, otherPublicKey],
        queryFn: () => getSharedEncryptionKey(otherPublicKey!, room.id),
        enabled: !!otherPublicKey,
    });

    return sharedKey;
}
