import { useUserId } from "@/app/_components/UserIdProvider";
import { useEffect } from "react";
import { useRoom } from "../_components/RoomProvider";
import { useJoinRoom } from "./useJoinRoom";
import { useRealtime } from "./useRealtime";

export function useRoomInteractionController(realtimeToken: string) {
    const { room } = useRoom();
    const { mutate: joinRoom, status } = useJoinRoom();
    const { userId } = useUserId();
    const shouldJoin = !room.users.includes(userId) && status === "idle";

    useRealtime(realtimeToken);
    useEffect(() => {
        if (shouldJoin) joinRoom();
    }, [joinRoom, shouldJoin]);
}
