import { useUserId } from "@/app/_components/UserIdProvider";
import { Room } from "@/lib/db/schema";
import { SetRoom } from "@/lib/types";
import { useEffect } from "react";
import { useJoinRoom } from "./useJoinRoom";

export function useRoomJoiner(room: Room, setRoom: SetRoom) {
    const { userId } = useUserId();
    const { mutate: joinRoom, status } = useJoinRoom(room, setRoom);
    const shouldJoin = !room.users.includes(userId) && status === "idle";

    useEffect(() => {
        if (shouldJoin) joinRoom();
    }, [shouldJoin, joinRoom]);
}
