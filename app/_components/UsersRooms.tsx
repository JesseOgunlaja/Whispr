"use client";

import { api } from "@/lib/lib";
import styles from "@/styles/home.module.css";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function UsersRooms() {
    const { data: res, isLoading } = useQuery({
        queryKey: ["rooms"],
        queryFn: () => api.user.rooms.get(),
    });

    return (
        <aside className={styles.aside}>
            <p>
                {isLoading
                    ? "Loading rooms"
                    : res?.data?.rooms.length === 0
                    ? "No open rooms"
                    : "Open Rooms"}
            </p>
            <ul>
                {res?.data?.rooms.map((room) => (
                    <li key={room.id}>
                        <Link href={`/room/${room.id}`}>
                            {room.id}
                            <ArrowRight />
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    );
}
