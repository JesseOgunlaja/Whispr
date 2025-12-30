import { House } from "lucide-react";
import Link from "next/link";
import DestroyRoom from "./DestroyRoom";
import RoomID from "./RoomID";
import RoomTTL from "./RoomTTL";

export default function RoomInfo() {
    return (
        <header>
            <div>
                <p>Room ID:</p>
                <RoomID />
            </div>
            <hr />
            <div>
                <p>TTL:</p>
                <p>Time till self-destruct</p>
                <RoomTTL />
            </div>
            <div>
                <Link href="/">
                    <House />
                    <p>Home</p>
                </Link>
                <DestroyRoom />
            </div>
        </header>
    );
}
