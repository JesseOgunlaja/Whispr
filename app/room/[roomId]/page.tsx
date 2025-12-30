import styles from "@/styles/room.module.css";
import MessagesList from "./_components/MessagesList";
import RoomInfo from "./_components/RoomInfo";
import RoomSessionProvider from "./_components/RoomSessionProvider";
import SendMessage from "./_components/SendMessage";

export default async function Room() {
    return (
        <div className={styles.room}>
            <RoomSessionProvider>
                <RoomInfo />
                <MessagesList />
                <SendMessage />
            </RoomSessionProvider>
        </div>
    );
}
