import { api } from "@/lib/lib";
import { useQuery } from "@tanstack/react-query";
import { useRoomId } from "./useRoomId";
import { useRoomSessionController } from "./useRoomSessionController";

export function useRoomSessionData(
    signature: { signature: string; window: string } | undefined
) {
    const roomId = useRoomId();
    const { data: res } = useQuery({
        queryKey: ["room", roomId],
        queryFn: () => api.room({ roomId: roomId! }).get({ query: signature! }),
        enabled: !!signature && !!roomId,
    });

    useRoomSessionController(res);

    return { room: res?.data?.room, userId: res?.data?.userId };
}
