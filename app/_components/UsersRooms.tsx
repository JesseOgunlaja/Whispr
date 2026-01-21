"use client";

import { formatMessageDate } from "@/lib/lib";
import styles from "@/styles/home.module.css";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface PropsType {
    rooms: { id: string; lastUsed: Date }[];
}

export default function UsersRooms({ rooms }: PropsType) {
    return (
        <aside className={styles.aside}>
            <p>{rooms.length === 0 ? "No open rooms" : "Open Rooms"}</p>
            <ul>
                {rooms.map((room) => (
                    <li key={room.id}>
                        <Link href={`/room/${room.id}`}>
                            <div>
                                <span>{room.id}</span>
                                <span>
                                    Last used:{" "}
                                    {room.lastUsed
                                        ? formatMessageDate(room.lastUsed)
                                        : "Never"}
                                </span>
                            </div>
                            <ArrowRight />
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    );
}
