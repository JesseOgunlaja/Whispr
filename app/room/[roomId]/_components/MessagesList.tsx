"use client";

import { useUserId } from "@/app/_components/UserIdProvider";
import { formatMessageDate } from "@/lib/lib";
import styles from "@/styles/room.module.css";
import { useEffect, useRef } from "react";
import { useDecryptMessages } from "../_hooks/useDecryptMessages";
import { useRoomInteraction } from "./RoomInteractionProvider";

export default function MessagesList() {
    const { userId } = useUserId();
    const { optimisticMessages } = useRoomInteraction();
    const chatRef = useRef<HTMLUListElement>(null);
    const messages = useDecryptMessages();

    useEffect(() => {
        chatRef.current?.scrollTo({
            top: chatRef.current.scrollHeight,
        });
    }, [messages.length]);

    return (
        <main>
            <ul ref={chatRef}>
                {messages
                    .concat(optimisticMessages)
                    .sort(
                        (a, b) =>
                            +new Date(a.createdAt) - +new Date(b.createdAt)
                    )
                    .map((message) => (
                        <li key={message.id}>
                            <p
                                className={
                                    message.userId === userId
                                        ? styles.self
                                        : styles.other
                                }
                            >
                                {message.userId === userId
                                    ? "Me"
                                    : `anonymous-${message.userId.slice(
                                          0,
                                          5
                                      )}`}{" "}
                                <span>
                                    {formatMessageDate(message.createdAt)}
                                </span>
                            </p>
                            <p>{message.content}</p>
                        </li>
                    ))}
            </ul>
        </main>
    );
}
