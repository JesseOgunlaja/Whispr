"use client";

import { formatTTL } from "@/lib/lib";
import styles from "@/styles/room.module.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useRoom } from "../_components/RoomProvider";

export default function RoomTTL() {
    const router = useRouter();
    const { room } = useRoom();
    const [ttl, setTTL] = useState(() =>
        Math.floor((room.expiredAt.getTime() - Date.now()) / 1000)
    );

    useEffect(() => {
        function syncTTL() {
            setTTL(Math.floor((room.expiredAt.getTime() - Date.now()) / 1000));
        }

        window.addEventListener("focus", syncTTL);
        return () => window.removeEventListener("focus", syncTTL);
    }, [room]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTTL((prev) => Math.max(0, prev - 1));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (ttl <= 0) router.push("/?info=Room Destroyed");
    }, [ttl, router]);

    return (
        <p
            className={
                room
                    ? ttl < 300
                        ? ttl < 60
                            ? styles.red
                            : styles.amber
                        : styles.green
                    : styles.loading
            }
        >
            {formatTTL(ttl)}
        </p>
    );
}
