import { and, arrayContains, eq, lt, sql } from "drizzle-orm";
import { db } from "./db";
import { Message, messages, Room, rooms } from "./schema";

export async function getRoomById<T extends boolean>(
    roomId: string,
    withMessages: T,
): Promise<(T extends true ? Room : Omit<Room, "messages">) | null> {
    return (await db.query.rooms.findFirst({
        where: and(eq(rooms.id, roomId), lt(sql`NOW()`, rooms.expiredAt)),
        with: withMessages ? { messages: true } : undefined,
    })) as (T extends true ? Room : Omit<Room, "messages">) | null;
}

export async function createRoom(room: Omit<Room, "expiredAt" | "messages">) {
    return await db.insert(rooms).values(room).returning({ id: rooms.id });
}

export async function createMessage(
    message: Omit<Message, "id" | "createdAt">,
) {
    return (await db.insert(messages).values(message).returning())[0];
}

export async function updateRoom(room: Partial<Room>, roomId: string) {
    return await db.update(rooms).set(room).where(eq(rooms.id, roomId));
}

export async function deleteRoom(roomId: string) {
    return await db.delete(rooms).where(eq(rooms.id, roomId));
}

export async function getUsersRooms(userId: string) {
    return await db.query.rooms.findMany({
        where: and(
            arrayContains(rooms.users, [userId]),
            lt(sql`NOW()`, rooms.expiredAt),
        ),
        columns: { id: true, lastActive: true },
    });
}

export async function deleteExpiredRooms() {
    return await db.delete(rooms).where(lt(rooms.expiredAt, sql`NOW()`));
}
