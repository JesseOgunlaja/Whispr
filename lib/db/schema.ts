import { relations, sql } from "drizzle-orm";
import {
    check,
    integer,
    json,
    jsonb,
    pgTable,
    text,
    timestamp,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import z from "zod";

export const rooms = pgTable(
    "rooms",
    {
        id: text().primaryKey(),
        expiredAt: timestamp("expired_at")
            .default(sql`NOW() + INTERVAL '10 minutes'`)
            .notNull(),
        users: jsonb().$type<string[]>().notNull(),
        publicKeys: json("public_keys")
            .$type<
                Record<string, { encryptionKey: string; signingKey: string }>
            >()
            .notNull(),
    },
    (t) => [check("rooms_max_users", sql`jsonb_array_length(${t.users}) <= 2`)]
);

const _roomSchema = createSelectSchema(rooms);
export type Room = z.infer<typeof _roomSchema> & {
    messages: Message[];
};

export const roomRelations = relations(rooms, ({ many }) => ({
    messages: many(messages),
}));

export const messages = pgTable("messages", {
    id: integer().generatedByDefaultAsIdentity().primaryKey(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    roomId: text("room_id")
        .notNull()
        .references(() => rooms.id, { onDelete: "cascade" }),
    ciphertext: text("cipher_text").notNull(),
    userId: text("user_id").notNull(),
    iv: text().notNull(),
});

const _messageSchema = createSelectSchema(messages);
export type Message = z.infer<typeof _messageSchema>;

export const messageRelations = relations(messages, ({ one }) => ({
    room: one(rooms, {
        fields: [messages.roomId],
        references: [rooms.id],
    }),
}));
