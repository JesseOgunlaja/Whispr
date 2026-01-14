import { getRoomById } from "@/lib/db/dal";
import { env } from "@/lib/env";
import { getUserIdHeader } from "@/lib/server-lib";
import styles from "@/styles/room.module.css";
import { redirect } from "next/navigation";
import { createToken } from "streamthing";
import MessagesList from "./_components/MessagesList";
import RoomInfo from "./_components/RoomInfo";
import RoomInteractionProvider from "./_components/RoomInteractionProvider";
import RoomProvider from "./_components/RoomProvider";
import SendMessage from "./_components/SendMessage";

interface PropsType {
    params: Promise<{ roomId: string }>;
}

export default async function Room({ params }: PropsType) {
    const { roomId } = await params;
    const userId = await getUserIdHeader();
    const [room, realtimeToken] = await Promise.all([
        getRoomById(roomId),
        await createToken({
            channel: roomId,
            password: env.STREAMTHING_SERVER_PASSWORD,
        }),
    ]);

    if (!userId) redirect("/?error=Unauthorized");
    if (!room) redirect("/?error=Room not found");
    if (!room.users.includes(userId)) {
        if (room.users.length === 2) redirect("/?error=Room is full");
    }

    return (
        <div className={styles.room}>
            <RoomProvider room={room}>
                <RoomInteractionProvider realtimeToken={realtimeToken}>
                    <RoomInfo />
                    <MessagesList />
                    <SendMessage />
                </RoomInteractionProvider>
            </RoomProvider>
        </div>
    );
}
