import { createSignature } from "@/lib/crypto/signing";
import { useQuery } from "@tanstack/react-query";
import { useRoomId } from "./useRoomId";

export function useSignature() {
    const roomId = useRoomId();
    const { data } = useQuery({
        queryKey: ["signature", roomId],
        queryFn: () => createSignature(roomId!),
        refetchInterval: 55000,
        refetchIntervalInBackground: true,
        gcTime: 0,
        enabled: !!roomId,
    });

    return data;
}
