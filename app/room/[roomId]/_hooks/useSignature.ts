import { usePublicKeys } from "@/app/_components/PublicKeysProvider";
import { createSignature } from "@/lib/crypto/signing";
import { useQuery } from "@tanstack/react-query";
import { useRoomId } from "./useRoomId";

export function useSignature() {
    const roomId = useRoomId();
    const { signingKey } = usePublicKeys();

    const { data } = useQuery({
        queryKey: ["signature", roomId, signingKey],
        queryFn: () => createSignature(roomId!),
        refetchInterval: 55000,
        refetchIntervalInBackground: true,
        enabled: !!roomId && !!signingKey,
    });

    return data;
}
