import QueryParamHandler from "@/app/_components/QueryParamHandler";
import UserIdentity from "@/app/_components/UserIdentity";
import { getUsersRooms } from "@/lib/db/dal";
import { getUserIdHeader } from "@/lib/server-lib";
import styles from "@/styles/home.module.css";
import CreateRoom from "./_components/CreateRoom";
import UsersRooms from "./_components/UsersRooms";

export default async function Home() {
    const rooms = await getUsersRooms(await getUserIdHeader());

    return (
        <div className={styles.page}>
            <QueryParamHandler />
            <main className={styles.main}>
                <h1>Whispr</h1>
                <p>A private, self-destructing chat app with E2EE</p>
                <div>
                    <p>Your Identity</p>
                    <UserIdentity />
                    <CreateRoom />
                </div>
            </main>
            <UsersRooms rooms={rooms} />
        </div>
    );
}
