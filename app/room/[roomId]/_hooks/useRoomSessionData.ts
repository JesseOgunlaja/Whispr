import { validWindow } from "@/lib/crypto/signing";
import { api } from "@/lib/lib";
import { Signature } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useRoomId } from "./useRoomId";
import { useRoomSessionController } from "./useRoomSessionController";

export function useRoomSessionData(signature: Signature | undefined) {
    const roomId = useRoomId();
    const { data: res } = useQuery({
        queryKey: ["room", roomId],
        queryFn: () => api.room({ roomId: roomId! }).get({ query: signature! }),
        enabled: !!signature && !!roomId && validWindow(signature.window),
    });

    useRoomSessionController(res);

    return { room: res?.data?.room, userId: res?.data?.userId };
}
