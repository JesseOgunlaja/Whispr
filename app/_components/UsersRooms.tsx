"use client";

import { formatMessageDate } from "@/lib/lib";
import styles from "@/styles/home.module.css";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface PropsType {
    rooms: { id: string; lastActive: Date | null }[];
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
                                    {room.lastActive
                                        ? formatMessageDate(room.lastActive)
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
