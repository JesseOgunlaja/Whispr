import { getRoomById } from "@/lib/db/dal";
import { getUserIdHeader } from "@/lib/server-lib";
import styles from "@/styles/room.module.css";
import { redirect } from "next/navigation";
import MessagesList from "./_components/MessagesList";
import RoomInfo from "./_components/RoomInfo";
import RoomProvider from "./_components/RoomProvider";
import RoomRealtimeProvider from "./_components/RoomRealtimeProvider";
import SendMessage from "./_components/SendMessage";

interface PropsType {
    params: Promise<{ roomId: string }>;
}

export default async function Room({ params }: PropsType) {
    const { roomId } = await params;
    const userId = await getUserIdHeader();
    const room = await getRoomById(roomId, true);

    if (!userId) redirect("/?error=Unauthorized");
    if (!room) redirect("/?error=Room not found");
    if (!room.users.includes(userId) && room.users.length === 2) {
        redirect("/?error=Room is full");
    }

    return (
        <div className={styles.room}>
            <RoomProvider room={room}>
                <RoomRealtimeProvider>
                    <RoomInfo />
                    <MessagesList />
                    <SendMessage />
                </RoomRealtimeProvider>
            </RoomProvider>
        </div>
    );
}
