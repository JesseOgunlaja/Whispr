import QueryParamHandler from "@/app/_components/QueryParamHandler";
import UserIdentity from "@/app/_components/UserIdentity";
import styles from "@/styles/home.module.css";
import { Suspense } from "react";
import CreateRoom from "./_components/CreateRoom";
import UsersRooms from "./_components/UsersRooms";

export default async function Home() {
    return (
        <div className={styles.page}>
            <QueryParamHandler />
            <main className={styles.main}>
                <h1>Whispr</h1>
                <p>A private, self-destructing chat app with E2EE</p>
                <div>
                    <p>Your Identity</p>
                    <Suspense fallback={<div>anonymous-...</div>}>
                        <UserIdentity />
                    </Suspense>
                    <CreateRoom />
                </div>
            </main>
            <UsersRooms />
        </div>
    );
}
